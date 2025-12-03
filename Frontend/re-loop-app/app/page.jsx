"use client"

import { GlobalProvider, useGlobal } from "../context/global-context"
import { Landing } from "@/components/reloop/Landing"
import { Auth } from "@/components/reloop/Auth"
import { Home } from "@/components/reloop/Home"
import { AddItem } from "@/components/reloop/AddItem"
import { Profile } from "@/components/reloop/Profile"
import { Saved } from "@/components/reloop/Saved"
import "@/app/reloop.css"

function AppContent() {
 const { currentView, isAuthenticated } = useGlobal()

 if (!isAuthenticated && currentView !== "landing" && currentView !== "auth") {
 return <Landing />
 }

 if (isAuthenticated && (currentView === "landing" || currentView === "auth")) {
 return <Home />
 }

 switch (currentView) {
 case "landing":
 return <Landing />
 case "auth":
 return <Auth />
 case "home":
 return <Home />
 case "add-item":
 return <AddItem />
 case "profile":
 return <Profile />
 case "saved":
 return <Saved />
 default:
 return <Home />
 }
}

export default function ReLoopApp() {
 return (
 <GlobalProvider>
 <div className="reloop-app">
 <AppContent />
 </div>
 </GlobalProvider>
 )
}
