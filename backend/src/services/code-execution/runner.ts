import Docker from 'dockerode'
import { logger } from '../../utils/logger'

const docker = new Docker()

export interface ExecutionResult {
  success: boolean
  output: string
  error?: string
  executionTime: number
}

export class CodeRunner {
  private async createContainer(language: string, code: string): Promise<any> {
    const imageMap: { [key: string]: string } = {
      javascript: 'node:18-alpine',
      typescript: 'node:18-alpine',
      python: 'python:3.11-alpine',
      java: 'openjdk:11-alpine',
      cpp: 'gcc:latest',
    }

    const containerConfig = {
      Image: imageMap[language] || 'node:18-alpine',
      Cmd: this.getCommandForLanguage(language),
      AttachStdout: true,
    }

    const container = await docker.createContainer(containerConfig)
    return container
  }

  private getCommandForLanguage(language: string): string[] {
    const commandMap: { [key: string]: string[] } = {
      javascript: ['/bin/sh', '-c', 'echo "$CODE" | node'],
      python: ['/bin/sh', '-c', 'echo "$CODE" | python'],
      java: ['/bin/sh', '-c', 'echo "$CODE" | javac && java'],
    }
    return commandMap[language] || commandMap.javascript
  }

  async runCode(language: string, code: string, timeout: number = 10000): Promise<ExecutionResult> {
    const startTime = Date.now()
    let container: any = null

    try {
      container = await this.createContainer(language, code)
      await container.start()

      // Wait for container to finish with timeout
      await new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          reject(new Error('Execution timeout'))
        }, timeout)

        container.wait((err: any, data: any) => {
          clearTimeout(timer)
          if (err) reject(err)
          else resolve(data)
        })
      })

      // Get logs
      const logs = await container.logs({
        stdout: true,
        stderr: true,
      })

      const output = logs.toString('utf8')
      const executionTime = Date.now() - startTime

      await container.remove()

      return {
        success: true,
        output,
        executionTime,
      }
    } catch (error: any) {
      logger.error('Code execution error:', error)

      if (container) {
        try {
          await container.kill()
          await container.remove()
        } catch (e) {
          // Ignore cleanup errors
        }
      }

      return {
        success: false,
        output: '',
        error: error.message,
        executionTime: Date.now() - startTime,
      }
    }
  }
}

export const codeRunner = new CodeRunner()
