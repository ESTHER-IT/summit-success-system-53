
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useData, Paper } from '@/contexts/DataContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileUp, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const AuthorDashboard = () => {
  const { user } = useAuth();
  const { getPapersByAuthor, submitPaper } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Form state
  const [paperTitle, setPaperTitle] = useState('');
  const [paperAbstract, setPaperAbstract] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get papers by the current author
  const authorPapers = user ? getPapersByAuthor(user.id) : [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!paperTitle || !paperAbstract || !selectedFile) {
      alert('Please fill in all fields and upload a PDF file');
      return;
    }
    
    if (selectedFile.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate file upload delay
    setTimeout(() => {
      // In a real app, you would upload the file to a server
      // Here we just use the filename
      if (user) {
        submitPaper(user.id, paperTitle, paperAbstract, selectedFile.name);
        
        // Reset form
        setPaperTitle('');
        setPaperAbstract('');
        setSelectedFile(null);
        setIsSubmitting(false);
        setIsDialogOpen(false);
      }
    }, 1500);
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: Paper['status'] }) => {
    switch (status) {
      case 'submitted':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock size={14} className="mr-1" /> Submitted</Badge>;
      case 'under review':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200"><Loader2 size={14} className="mr-1" /> Under Review</Badge>;
      case 'reviewed':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200"><CheckCircle size={14} className="mr-1" /> Reviewed</Badge>;
      case 'accepted':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle size={14} className="mr-1" /> Accepted</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><AlertCircle size={14} className="mr-1" /> Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout requiredRole="author">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Author Dashboard</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <FileUp size={16} className="mr-2" />
                Submit New Paper
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Submit a New Paper</DialogTitle>
                <DialogDescription>
                  Fill in the details and upload your paper in PDF format.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Paper Title</Label>
                  <Input 
                    id="title"
                    value={paperTitle}
                    onChange={(e) => setPaperTitle(e.target.value)}
                    placeholder="Enter the title of your paper"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="abstract">Abstract</Label>
                  <Textarea 
                    id="abstract"
                    value={paperAbstract}
                    onChange={(e) => setPaperAbstract(e.target.value)}
                    placeholder="Enter the abstract of your paper"
                    rows={4}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="file">Paper (PDF only)</Label>
                  <Input 
                    id="file"
                    type="file"
                    accept=".pdf" 
                    onChange={handleFileChange}
                    required
                  />
                </div>
                
                <DialogFooter>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full sm:w-auto"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      'Submit Paper'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>My Papers</CardTitle>
              <CardDescription>
                View and manage your submitted papers
              </CardDescription>
            </CardHeader>
            <CardContent>
              {authorPapers.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {authorPapers.map((paper) => (
                      <TableRow key={paper.id}>
                        <TableCell className="font-medium">{paper.title}</TableCell>
                        <TableCell>
                          <StatusBadge status={paper.status} />
                        </TableCell>
                        <TableCell>
                          {new Date(paper.submittedAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <FileUp size={32} className="mx-auto mb-2 text-gray-400" />
                  <p>You haven't submitted any papers yet</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Conference Information</CardTitle>
              <CardDescription>
                Important information about the conference
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-sm text-gray-500">SUBMISSION DEADLINE</h3>
                <p className="text-lg">April 30, 2025</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-gray-500">REVIEW PERIOD</h3>
                <p className="text-lg">May 1-15, 2025</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-gray-500">RESULTS ANNOUNCEMENT</h3>
                <p className="text-lg">May 20, 2025</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-gray-500">CONFERENCE DATE</h3>
                <p className="text-lg">June 15-17, 2025</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Download Submission Guidelines
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AuthorDashboard;
