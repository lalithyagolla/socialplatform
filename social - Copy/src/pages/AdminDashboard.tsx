import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import { adminService } from '../services/api';
import { Shield, AlertTriangle, Users, BarChart2, Check, X } from 'lucide-react';

interface ReportedContent {
  id: string;
  contentId: string;
  userId: string;
  reason: string;
  status: 'pending' | 'approved' | 'removed';
  createdAt: string;
  content: {
    id: string;
    title: string;
    content: string;
    source: string;
    url: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
  points: number;
}

interface Stats {
  totalUsers: number;
  activeUsers: number;
  totalContent: number;
  totalReports: number;
  topContent: Array<{ id: string; title: string; saves: number }>;
  mostActiveUsers: Array<{ id: string; name: string; activity: number }>;
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [reportedContent, setReportedContent] = useState<ReportedContent[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (activeTab === 'reports') {
      fetchReportedContent();
    } else if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'overview') {
      fetchStats();
    }
  }, [activeTab]);
  
  const fetchReportedContent = async () => {
    try {
      setLoading(true);
      const response = await adminService.getReportedContent();
      setReportedContent(response.data.reports);
    } catch (err) {
      console.error('Failed to fetch reported content:', err);
      setError('Failed to load reported content.');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getUsers();
      setUsers(response.data.users);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await adminService.getStats();
      setStats(response.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      setError('Failed to load statistics.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleResolveReport = async (reportId: string, action: 'approve' | 'remove') => {
    try {
      await adminService.resolveReport(reportId, action);
      // Update local state
      setReportedContent((prev) =>
        prev.map((report) =>
          report.id === reportId
            ? { ...report, status: action === 'approve' ? 'approved' : 'removed' }
            : report
        )
      );
    } catch (err) {
      console.error('Failed to resolve report:', err);
    }
  };
  
  const handleToggleAdminRole = async (userId: string, isAdmin: boolean) => {
    try {
      await adminService.updateUserRole(userId, isAdmin);
      // Update local state
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, isAdmin } : user
        )
      );
    } catch (err) {
      console.error('Failed to update user role:', err);
    }
  };

  // Mock data for demo
  const mockReportedContent: ReportedContent[] = [
    {
      id: '1',
      contentId: '123',
      userId: '456',
      reason: 'This content contains misleading information about AI development.',
      status: 'pending',
      createdAt: '2025-01-15T14:30:00Z',
      content: {
        id: '123',
        title: 'AI Will Replace All Jobs by 2026',
        content: 'According to our research, artificial intelligence will replace all human jobs by 2026. This is a fact and cannot be disputed.',
        source: 'twitter',
        url: 'https://twitter.com/fakeuser/status/1234567890'
      },
      user: {
        id: '456',
        name: 'John Smith',
        email: 'john@example.com'
      }
    },
    {
      id: '2',
      contentId: '124',
      userId: '457',
      reason: 'Content promotes harmful practices in coding.',
      status: 'pending',
      createdAt: '2025-01-14T09:15:00Z',
      content: {
        id: '124',
        title: 'Why You Should Never Test Your Code',
        content: 'Testing is a waste of time. Just deploy directly to production and fix issues as users report them.',
        source: 'reddit',
        url: 'https://reddit.com/r/programming/comments/abc123'
      },
      user: {
        id: '457',
        name: 'Emma Johnson',
        email: 'emma@example.com'
      }
    }
  ];

  const mockUsers: User[] = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john@example.com',
      isAdmin: false,
      createdAt: '2024-10-15T08:30:00Z',
      points: 120
    },
    {
      id: '2',
      name: 'Emma Johnson',
      email: 'emma@example.com',
      isAdmin: false,
      createdAt: '2024-11-05T14:20:00Z',
      points: 85
    },
    {
      id: '3',
      name: 'Admin User',
      email: 'admin@example.com',
      isAdmin: true,
      createdAt: '2024-09-01T10:00:00Z',
      points: 250
    }
  ];

  const mockStats: Stats = {
    totalUsers: 1245,
    activeUsers: 876,
    totalContent: 5432,
    totalReports: 37,
    topContent: [
      { id: '1', title: 'Understanding React Hooks', saves: 128 },
      { id: '2', title: 'Machine Learning in 2025', saves: 104 },
      { id: '3', title: 'The Future of Remote Work', saves: 97 }
    ],
    mostActiveUsers: [
      { id: '1', name: 'John Smith', activity: 78 },
      { id: '2', name: 'Emma Johnson', activity: 65 },
      { id: '3', name: 'Alex Williams', activity: 52 }
    ]
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3">
        <Shield className="h-8 w-8 text-orange-500" />
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white p-1 rounded-lg shadow-sm border border-gray-100">
          <TabsTrigger value="overview" className="py-2 px-4 rounded-md">
            Overview
          </TabsTrigger>
          <TabsTrigger value="reports" className="py-2 px-4 rounded-md">
            Content Reports
          </TabsTrigger>
          <TabsTrigger value="users" className="py-2 px-4 rounded-md">
            User Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="pt-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
                    <Users className="h-5 w-5 text-blue-500" />
                  </div>
                  <p className="text-3xl font-bold text-gray-800">{mockStats.totalUsers}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    <span className="text-green-600 font-medium">{Math.round(mockStats.activeUsers / mockStats.totalUsers * 100)}%</span> active users
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-500 text-sm font-medium">Active Users</h3>
                    <Users className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="text-3xl font-bold text-gray-800">{mockStats.activeUsers}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    In the last 30 days
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-500 text-sm font-medium">Total Content</h3>
                    <BarChart2 className="h-5 w-5 text-orange-500" />
                  </div>
                  <p className="text-3xl font-bold text-gray-800">{mockStats.totalContent}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Across all platforms
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-500 text-sm font-medium">Content Reports</h3>
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  </div>
                  <p className="text-3xl font-bold text-gray-800">{mockStats.totalReports}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    <span className="text-red-600 font-medium">{mockReportedContent.filter(r => r.status === 'pending').length}</span> pending review
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Saved Content</h3>
                  <div className="space-y-4">
                    {mockStats.topContent.map((content, index) => (
                      <div key={content.id} className="flex items-center justify-between pb-2 border-b border-gray-100">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-medium">
                            {index + 1}
                          </div>
                          <div className="ml-3 truncate max-w-xs">
                            <p className="text-sm font-medium text-gray-800 truncate">{content.title}</p>
                          </div>
                        </div>
                        <p className="text-sm font-medium text-gray-600">
                          {content.saves} saves
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Most Active Users</h3>
                  <div className="space-y-4">
                    {mockStats.mostActiveUsers.map((user, index) => (
                      <div key={user.id} className="flex items-center justify-between pb-2 border-b border-gray-100">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-medium">
                            {index + 1}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-800">{user.name}</p>
                          </div>
                        </div>
                        <p className="text-sm font-medium text-gray-600">
                          {user.activity} actions
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="reports" className="pt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Content Reports</h2>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          ) : mockReportedContent.length > 0 ? (
            <div className="space-y-6">
              {mockReportedContent.map((report) => (
                <div key={report.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{report.content.title}</h3>
                      <p className="text-sm text-gray-500">
                        Reported by {report.user.name} ({report.user.email}) on {new Date(report.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {report.status}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Report Reason:</h4>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded border border-gray-100">
                      {report.reason}
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Content:</h4>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded border border-gray-100">
                      {report.content.content}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Source: {report.content.source} - <a href={report.content.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View Original</a>
                    </p>
                  </div>
                  
                  {report.status === 'pending' && (
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleResolveReport(report.id, 'approve')}
                        className="flex items-center space-x-1 px-4 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                      >
                        <Check className="h-4 w-4" />
                        <span>Approve Content</span>
                      </button>
                      <button
                        onClick={() => handleResolveReport(report.id, 'remove')}
                        className="flex items-center space-x-1 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                      >
                        <X className="h-4 w-4" />
                        <span>Remove Content</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-600">No reported content to review.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="users" className="pt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">User Management</h2>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Points
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Admin Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockUsers.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-medium">
                              {user.name.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.points}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          {user.isAdmin ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Admin
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                              User
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleToggleAdminRole(user.id, !user.isAdmin)}
                            className={`px-3 py-1 rounded text-xs font-medium ${
                              user.isAdmin
                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            } transition-colors`}
                          >
                            {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;