// Check if a user is admin (and have access to the admin panel)
export default function(context) {
  const { store, redirect } = context
  const isAuthenticated = store.getters['auth/isAuthenticated']
  if (isAuthenticated) {
    const isAdmin = store.getters['auth/user'].permissions.includes('admin')
    if (!isAdmin) {
      redirect('/')
    }
  } else {
    redirect('/')
  }
}
