
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useData, Paper } from '@/contexts/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FileText, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ReviewerDashboard = () => {
  const { user } = useAuth();
  const { getPapersForReviewer, submitReview } = useData();
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  
  // Review form state
  const [reviewScore, setReviewScore] = useState<number>(5);
  const [reviewComments, setReviewComments] = useState('');
  
  // Get papers assigned to this reviewer
  const assignedPapers = user ? getPapersForReviewer(user.id) : [];
  
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPaper || !user) return;
    
    // Submit the review
    submitReview(selectedPaper.id, user.id, reviewScore, reviewComments);
    
    // Reset form and close dialog
    setReviewScore(5);
    setReviewComments('');
    setIsReviewDialogOpen(false);
    setSelectedPaper(null);
  };
  
  const openReviewDialog = (paper: Paper) => {
    setSelectedPaper(paper);
    setIsReviewDialogOpen(true);
  };

  return (
    <DashboardLayout requiredRole="reviewer">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Reviewer Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Papers to Review</CardTitle>
              <CardDescription>
                Papers assigned to you for review
              </CardDescription>
            </CardHeader>
            <CardContent>
              {assignedPapers.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Submission Date</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assignedPapers.map((paper) => (
                      <TableRow key={paper.id}>
                        <TableCell className="font-medium">{paper.title}</TableCell>
                        <TableCell>{new Date(paper.submittedAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => openReviewDialog(paper)}
                          >
                            Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  <CheckCircle size={32} className="mx-auto mb-2 text-green-500" />
                  <p>You have no pending papers to review</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Reviewer Guidelines</CardTitle>
              <CardDescription>
                How to review papers effectively
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">1. Evaluate Thoroughly</h3>
                <p className="text-sm text-gray-600">
                  Read the entire paper carefully and evaluate its academic merit, originality, and relevance.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold">2. Be Constructive</h3>
                <p className="text-sm text-gray-600">
                  Provide constructive feedback that helps the author improve their work.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold">3. Score Consistently</h3>
                <p className="text-sm text-gray-600">
                  Use the full range of the scoring system (1-10):
                </p>
                <ul className="text-sm text-gray-600 pl-5 list-disc">
                  <li>1-3: Significant issues, reject</li>
                  <li>4-6: Needs major revisions</li>
                  <li>7-8: Good with minor revisions</li>
                  <li>9-10: Excellent, accept as is</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold">4. Maintain Confidentiality</h3>
                <p className="text-sm text-gray-600">
                  Do not share or discuss the papers you are reviewing with others.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Submit Review</DialogTitle>
            <DialogDescription>
              {selectedPaper?.title}
            </DialogDescription>
          </DialogHeader>
          
          <div className="my-4 p-4 bg-gray-50 rounded-md">
            <h3 className="font-semibold mb-2">Abstract</h3>
            <p className="text-sm text-gray-700">{selectedPaper?.abstract}</p>
            <div className="mt-4">
              <Button variant="outline" size="sm" className="text-xs">
                <FileText size={14} className="mr-1" />
                Download Full Paper
              </Button>
            </div>
          </div>
          
          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="score">Score (1-10)</Label>
              <div className="flex items-center space-x-4">
                <input
                  id="score"
                  type="range"
                  min="1"
                  max="10"
                  value={reviewScore}
                  onChange={(e) => setReviewScore(parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                  {reviewScore}
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 px-1">
                <span>Poor</span>
                <span>Excellent</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="comments">Review Comments</Label>
              <Textarea
                id="comments"
                value={reviewComments}
                onChange={(e) => setReviewComments(e.target.value)}
                placeholder="Provide detailed feedback on the paper's strengths, weaknesses, and areas for improvement."
                rows={8}
                required
              />
            </div>
            
            <DialogFooter>
              <Button type="submit">Submit Review</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default ReviewerDashboard;
