import { NavLink, Outlet } from 'react-router-dom'

const link = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-3 ${isActive ? 'bg-accent-soft font-medium' : 'text-muted hover:bg-accent-soft'}`

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-wrap">
      <nav className="flex w-full flex-col gap-1 border-r border-line bg-white px-4 py-7 md:w-56">
        <div className="px-3 pb-5 text-xl font-bold text-accent">SnapLedger</div>
        <NavLink to="/upload" className={link}>Upload</NavLink>
        <NavLink to="/documents" className={link}>Documents</NavLink>
      </nav>
      <main className="min-w-0 flex-1 p-6 md:p-10">
        <Outlet />
      </main>
    </div>
  )
}
