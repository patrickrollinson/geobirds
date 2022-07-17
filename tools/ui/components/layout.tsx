import Navbar from './navbar'

export default function Layout({ children }: { children: any }) {
  return (
    <>
      <Navbar />
      <main className='flex flex-col justify-center items-center'>{children}</main>
    </>
  )
}