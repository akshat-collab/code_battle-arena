import { AutomationBuilder } from '@/components/automation-builder/AutomationBuilder'

export default function AutomatePage() {
  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="border-b border-dark-border bg-dark-card">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold">Workflow Automation Builder</h1>
          <p className="text-gray-400">Create powerful automation workflows with visual tools</p>
        </div>
      </div>
      <AutomationBuilder />
    </div>
  )
}

