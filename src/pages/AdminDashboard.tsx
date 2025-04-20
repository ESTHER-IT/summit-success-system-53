
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useData, Paper, Review } from '@/contexts/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileText, User, Award, ThumbsUp, ThumbsDown } from 'lucide-react';

const AdminDashboard = () => {
  const { getAllPapers, getReviewsByPaper, updatePaperStatus, assignReviewer } = useData();
  const { user } = useAuth();
  
  // Get all papers
  const allPapers = getAllPapers();
  
  // State for review dialog
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  
  // State for winner dialog
  const [isWinnerDialogOpen, setIsWinnerDialogOpen] = useState(false);
  
  // Function to view paper reviews
  const viewPaperReviews = (paper: Paper) => {
    setSelectedPaper(paper);
    setIsReviewDialogOpen(true);
  };
  
  // Function to assign a reviewer
  const handleAssignReviewer = (paperId: number) => {
    // In a real system, you would have a dialog to select a reviewer
    // For demo, we'll just assign the reviewer with ID 3
    const reviewerId = 3;
    assignReviewer(paperId, reviewerId);
  };
  
  // Function to accept a paper
  const acceptPaper = (paperId: number) => {
    const reviews = getReviewsByPaper(paperId);
    const avgScore = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.score, 0) / reviews.length 
      : 0;
    
    updatePaperStatus(paperId, 'accepted', avgScore);
  };
  
  // Function to reject a paper
  const rejectPaper = (paperId: number) => {
    const reviews = getReviewsByPaper(paperId);
    const avgScore = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.score, 0) / reviews.length 
      : 0;
    
    updatePaperStatus(paperId, 'rejected', avgScore);
  };
  
  // Statistics
  const stats = {
    total: allPapers.length,
    submitted: allPapers.filter(p => p.status === 'submitted').length,
    underReview: allPapers.filter(p => p.status === 'under review').length,
    reviewed: allPapers.filter(p => p.status === 'reviewed').length,
    accepted: allPapers.filter(p => p.status === 'accepted').length,
    rejected: allPapers.filter(p => p.status === 'rejected').length,
  };
  
  // Get paper reviews
  const getReviews = (paperId: number): Review[] => {
    return getReviewsByPaper(paperId);
  };

  return (
    <DashboardLayout requiredRole="admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Button onClick={() => setIsWinnerDialogOpen(true)}>
            <Award size={16} className="mr-2" />
            Manage Winners
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Total Papers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Under Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.underReview}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Accepted Papers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.accepted}</div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>All Papers</CardTitle>
            <CardDescription>
              View, assign and manage all submitted papers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reviews</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allPapers.map((paper) => {
                  const reviews = getReviews(paper.id);
                  const hasReviews = reviews.length > 0;
                  const avgScore = hasReviews 
                    ? (reviews.reduce((sum, review) => sum + review.score, 0) / reviews.length).toFixed(1) 
                    : 'N/A';
                  
                  return (
                    <TableRow key={paper.id}>
                      <TableCell className="font-medium">{paper.title}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={paper.status === 'accepted' ? 'default' : 'outline'}
                          className={`
                            ${paper.status === 'submitted' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
                            ${paper.status === 'under review' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                            ${paper.status === 'reviewed' ? 'bg-purple-50 text-purple-700 border-purple-200' : ''}
                            ${paper.status === 'accepted' ? 'bg-green-100 text-green-800' : ''}
                            ${paper.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                          `}
                        >
                          {paper.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {hasReviews ? (
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{avgScore}</span>
                            <span className="text-xs text-gray-500">({reviews.length} reviews)</span>
                          </div>
                        ) : (
                          <span className="text-gray-500">No reviews</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {paper.status === 'submitted' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleAssignReviewer(paper.id)}
                            >
                              <User size={14} className="mr-1" />
                              Assign
                            </Button>
                          )}
                          
                          {(paper.status === 'under review' || paper.status === 'reviewed') && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => viewPaperReviews(paper)}
                              >
                                <FileText size={14} className="mr-1" />
                                Reviews
                              </Button>
                              
                              {paper.status === 'reviewed' && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="default"
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => acceptPaper(paper.id)}
                                  >
                                    <ThumbsUp size={14} className="mr-1" />
                                    Accept
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => rejectPaper(paper.id)}
                                  >
                                    <ThumbsDown size={14} className="mr-1" />
                                    Reject
                                  </Button>
                                </>
                              )}
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
      {/* Paper Reviews Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Paper Reviews</DialogTitle>
            <DialogDescription>
              {selectedPaper?.title}
            </DialogDescription>
          </DialogHeader>
          
          <div className="my-4">
            {selectedPaper && getReviews(selectedPaper.id).length > 0 ? (
              <div className="space-y-4">
                {getReviews(selectedPaper.id).map((review) => (
                  <div key={review.id} className="border rounded-md p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-medium">Reviewer #{review.reviewerId}</div>
                      <Badge>Score: {review.score}/10</Badge>
                    </div>
                    <p className="text-sm text-gray-700">{review.comments}</p>
                    <div className="text-xs text-gray-500 mt-2">
                      Submitted on {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">
                No reviews available for this paper.
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Winner Management Dialog */}
      <Dialog open={isWinnerDialogOpen} onOpenChange={setIsWinnerDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Manage Winners</DialogTitle>
            <DialogDescription>
              Select papers to be featured as winners of the conference
            </DialogDescription>
          </DialogHeader>
          
          <div className="my-4">
            <h3 className="font-medium mb-2">Accepted Papers</h3>
            
            {allPapers.filter(p => p.status === 'accepted').length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Average Score</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allPapers
                    .filter(p => p.status === 'accepted')
                    .sort((a, b) => {
                      const aScore = a.finalScore || 0;
                      const bScore = b.finalScore || 0;
                      return bScore - aScore; // Sort by score descending
                    })
                    .map((paper) => {
                      const reviews = getReviews(paper.id);
                      const avgScore = reviews.length > 0 
                        ? (reviews.reduce((sum, review) => sum + review.score, 0) / reviews.length).toFixed(1) 
                        : 'N/A';
                      
                      return (
                        <TableRow key={paper.id}>
                          <TableCell className="font-medium">{paper.title}</TableCell>
                          <TableCell>{avgScore}</TableCell>
                          <TableCell>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-amber-600 border-amber-300 hover:bg-amber-50"
                            >
                              <Award size={14} className="mr-1" />
                              Make Winner
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-6 text-gray-500 border rounded-md">
                No accepted papers yet.
              </div>
            )}
            
            <div className="mt-6">
              <h3 className="font-medium mb-2">Current Winners</h3>
              <div className="text-center py-6 text-gray-500 border rounded-md">
                No winners have been declared yet.
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsWinnerDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminDashboard;
