export interface InfoPopupComponent {
  availableActions: {
    description: string
    callback: () => void
  }[]
}
