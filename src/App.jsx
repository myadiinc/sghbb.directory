import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import Directory from './pages/Directory';
import BusinessDetail from './pages/BusinessDetail';
import SubmitBusiness from './pages/SubmitBusiness';
import AdminDashboard from './pages/AdminDashboard';
import MyLists from './pages/MyLists';
import EditBusiness from './pages/EditBusiness';
import Blog from './pages/Blog';
import Help from './pages/Help';
import Info from './pages/Info';
import AdminBlogManager from './pages/AdminBlogManager';
import MyReviews from './pages/MyReviews';
import ReportHBB from './pages/ReportHBB';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route path="/" element={<Directory />} />
      <Route path="/business/:id" element={<BusinessDetail />} />
      <Route path="/submit" element={<SubmitBusiness />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/blog" element={<AdminBlogManager />} />
      <Route path="/my-lists" element={<MyLists />} />
      <Route path="/my-reviews" element={<MyReviews />} />
      <Route path="/report" element={<ReportHBB />} />
      <Route path="/edit-business/:id" element={<EditBusiness />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/help" element={<Help />} />
      <Route path="/info" element={<Info />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App