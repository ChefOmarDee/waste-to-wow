import Link from 'next/link';
import { useRouter } from 'next/router';

const Nav = () => {
  const router = useRouter();

  return (
<nav className="flex items-center justify-between bg-indigo-500 text-white py-4 px-6 w-full">
        <div className="flex items-center w-1/2 justify-center">
          <Link href="/">
            <div className={`${router.pathname === "/" ? "font-bold" : ""} ml-2 text-lg hover:text-gray-400`}>
              Home
            </div>
          </Link>
        </div>

        <div className="flex items-center w-1/2 justify-center">
          <Link href="/Add">
            <div className={`${router.pathname === "/Add" ? "font-bold" : ""} ml-2 text-lg hover:text-gray-400`}>
              Create Project
            </div>
          </Link>
        </div>

        <div className="flex items-center w-1/2 justify-center">
          <Link href="/AIProject">
            <div className={`${router.pathname === "/AIProject" ? "font-bold" : ""} ml-2 text-lg hover:text-gray-400`}>
              AI
            </div>
          </Link>
        </div>

        <div className="flex items-center w-1/2 justify-center">
          <Link href="/ViewAll">
            <div className={`${router.pathname === "/ViewAll" ? "font-bold" : ""} ml-2 text-lg hover:text-gray-400`}>
              View All
            </div>
          </Link>
        </div>


        <div className="flex items-center w-1/2 justify-center">
          <Link href="/ViewPersonal">
            <div className={`${router.pathname === "/ViewPersonal" ? "font-bold" : ""} ml-2 text-lg hover:text-gray-400`}>
            View Project
            </div>
          </Link>
        </div>

        <div className="flex items-center w-1/2 justify-center">
          <Link href="/SearchProject">
            <div className={`${router.pathname === "/SearchProject" ? "font-bold" : ""} ml-8 text-lg hover:text-gray-400`}>
              Search Project
            </div>
          </Link>
        </div>
      </nav>

  );
};

export default Nav;
