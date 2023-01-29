import React from "react";
import { Link } from "react-router-dom";
import { loginPath } from "../utils/config";

export default function Home() {
  return (
    <div className="container rounded-md bg-zinc-300 dark:bg-slate-500 h-full mx-auto dark:text-zinc-200 md:text-lg p-3">
      <h1 className="text-center text-3xl">Welcome to the PERN CRM App !</h1>
      <p className="lead">
        This is a simple tool to manage your customers and invoices <strong>(CRM)</strong>. It will allow you to register, modify and delete customers and invoices with ease. For do that, you will need to have an account in the application and log in. If you don't have an account yet, you can create one but it will be inactive and will have to be activated by the administrator.
      </p>
      <hr className="my-4 border-[1/16rem] border-black" />
      <p>
        However, you can use the following demo account credentials to discover the application.
      </p>
      <ul>
        <li>Email: <em>demo@pern-crm.com</em> </li>
        <li>Password : <em>password</em></li>
      </ul>
      <p className="text-2xl font-bold text-center">
        <Link to={loginPath}>
          So, Let's get start
        </Link>
      </p>
    </div>
  );
}
