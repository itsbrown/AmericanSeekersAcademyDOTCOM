import { Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import ProgramDetail from "@/pages/ProgramDetail";
import BlogList from "@/pages/BlogList";
import BlogPost from "@/pages/BlogPost";
import BlogAdmin from "@/pages/BlogAdmin";
import AdminDashboard from "@/pages/AdminDashboard";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnalyticsTracker from "@/components/common/AnalyticsTracker";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/programs/:slug" component={ProgramDetail} />
      <Route path="/blog" component={BlogList} />
      <Route path="/blog/admin" component={BlogAdmin} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/admin" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <TooltipProvider>
      <AnalyticsTracker />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Router />
        </main>
        <Footer />
      </div>
      <Toaster />
    </TooltipProvider>
  );
}

export default App;
