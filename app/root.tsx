import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node";
import {
  Form,
  Links,
  LiveReload,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  redirect,
  useLoaderData,
} from "@remix-run/react";

import { client, logout } from './pocketbase.js'

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export function action() {
  //LOGOUT
  logout()
  return redirect("/")
}

export async function loader() {
  return client.authStore.isValid
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Header />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

function Header() {
  const isUserValid = useLoaderData<typeof loader>()
  return (
    <div>
      <NavLink to="/">Home</NavLink>
      {!isUserValid && <NavLink to="login">Login</NavLink>}       {/*Conditionally render when not logged in*/}
      {!isUserValid &&<NavLink to="signup">Sign Up</NavLink>}    {/*Conditionally render when not logged in*/}
      {isUserValid && <NavLink to="list">List</NavLink>}         {/*Conditionally render when logged in*/}
      {isUserValid && <Form method="post"><button type="submit">Logout</button></Form>}     {/*Conditionally render when logged in*/}
    </div>
  )
}