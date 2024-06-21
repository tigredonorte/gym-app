import { Settings } from "@gym-app/ui"
import { Button, Switch } from "@mui/material"

interface AccountSettingsProps {
  onChange(option: string, value: boolean): void
  config: Record<string, boolean>
}

export const AccountSettings: React.FC<AccountSettingsProps> = (props: AccountSettingsProps) => {
  const { onChange, config } = props
  return (
		<Settings.Container title='Public Profile'>
      <Settings.Item
        title="Make Contact Info Public"
        subtitle="Means that anyone viewing your profile will be able to see your contacts details."
      >
        <Switch defaultChecked={config?.publicProfile} onChange={(e,value) => onChange('publicProfile', value)} />
      </Settings.Item>

      <Settings.Item
        title="Make Contact Info Public"
        subtitle="Means that anyone viewing your profile will be able to see your contacts details."
      >
        <Button variant="outlined" color="info">
          Enable Public Profile
        </Button>
      </Settings.Item>
    </Settings.Container>
  )
}