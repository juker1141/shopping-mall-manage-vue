export type routeType = 'layout' | 'list' | 'add' | 'edit' | 'delete'

// export function checkPageType(type: routeType ) {

// }

export function isAddPageType(type: routeType): boolean {
  if (type === 'add')
    return true
  return false
}
export function isEditPageType(type: routeType): boolean {
  if (type === 'edit')
    return true
  return false
}
export function isDeletePageType(type: routeType): boolean {
  if (type === 'delete')
    return true
  return false
}
