
import React, { createContext, useContext, useState } from 'react';
import { toast } from '@/components/ui/use-toast';

// Types
export interface Paper {
  id: number;
  userId: number;
  title: string;
  abstract: string;
  filename: string;
  status: 'submitted' | 'under review' | 'reviewed' | 'accepted' | 'rejected';
  finalScore?: number;
  submittedAt: string;
}

export interface Review {
  id: number;
  paperId: number;
  reviewerId: number;
  score: number;
  comments: string;
  createdAt: string;
}

interface DataContextType {
  papers: Paper[];
  reviews: Review[];
  submitPaper: (userId: number, title: string, abstract: string, filename: string) => void;
  assignReviewer: (paperId: number, reviewerId: number) => void;
  submitReview: (paperId: number, reviewerId: number, score: number, comments: string) => void;
  updatePaperStatus: (paperId: number, status: Paper['status'], finalScore?: number) => void;
  getPapersByAuthor: (authorId: number) => Paper[];
  getPapersForReviewer: (reviewerId: number) => Paper[];
  getAllPapers: () => Paper[];
  getReviewsByPaper: (paperId: number) => Review[];
  getPaperById: (paperId: number) => Paper | undefined;
}

// Mock initial data
const initialPapers: Paper[] = [
  {
    id: 1,
    userId: 2,
    title: "Advances in Machine Learning",
    abstract: "This paper explores recent advances in machine learning techniques and their applications.",
    filename: "advances_ml.pdf",
    status: "under review",
    submittedAt: "2025-04-15T10:30:00Z"
  },
  {
    id: 2,
    userId: 2,
    title: "Blockchain in Healthcare",
    abstract: "An analysis of blockchain applications in the healthcare industry.",
    filename: "blockchain_healthcare.pdf",
    status: "submitted",
    submittedAt: "2025-04-18T14:45:00Z"
  },
];

const initialReviews: Review[] = [
  {
    id: 1,
    paperId: 1,
    reviewerId: 3,
    score: 7,
    comments: "Good research, but needs more experimental data to support conclusions.",
    createdAt: "2025-04-19T09:15:00Z"
  }
];

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [papers, setPapers] = useState<Paper[]>(initialPapers);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);

  // Submit a new paper
  const submitPaper = (userId: number, title: string, abstract: string, filename: string) => {
    const newPaper: Paper = {
      id: papers.length + 1,
      userId,
      title,
      abstract,
      filename,
      status: 'submitted',
      submittedAt: new Date().toISOString()
    };
    
    setPapers([...papers, newPaper]);
    
    toast({
      title: "Paper submitted",
      description: "Your paper has been successfully submitted for review."
    });
  };

  // Assign a reviewer to a paper
  const assignReviewer = (paperId: number, reviewerId: number) => {
    // Update paper status to 'under review'
    setPapers(papers.map(paper => 
      paper.id === paperId 
        ? { ...paper, status: 'under review' } 
        : paper
    ));
    
    toast({
      title: "Reviewer assigned",
      description: "The reviewer has been successfully assigned to the paper."
    });
  };

  // Submit a review for a paper
  const submitReview = (paperId: number, reviewerId: number, score: number, comments: string) => {
    const newReview: Review = {
      id: reviews.length + 1,
      paperId,
      reviewerId,
      score,
      comments,
      createdAt: new Date().toISOString()
    };
    
    setReviews([...reviews, newReview]);
    
    // Update paper status to 'reviewed'
    setPapers(papers.map(paper => 
      paper.id === paperId 
        ? { ...paper, status: 'reviewed' } 
        : paper
    ));
    
    toast({
      title: "Review submitted",
      description: "Your review has been successfully submitted."
    });
  };

  // Update paper status (including final decision)
  const updatePaperStatus = (paperId: number, status: Paper['status'], finalScore?: number) => {
    setPapers(papers.map(paper => 
      paper.id === paperId 
        ? { ...paper, status, finalScore } 
        : paper
    ));
    
    toast({
      title: "Paper status updated",
      description: `The paper status has been updated to ${status}.`
    });
  };

  // Get papers by author ID
  const getPapersByAuthor = (authorId: number) => {
    return papers.filter(paper => paper.userId === authorId);
  };

  // Get papers assigned to a reviewer
  const getPapersForReviewer = (reviewerId: number) => {
    // Get all paper IDs that have been assigned to this reviewer
    const reviewedPaperIds = reviews
      .filter(review => review.reviewerId === reviewerId)
      .map(review => review.paperId);
    
    // Return all papers with status 'under review' that haven't been reviewed by this reviewer
    return papers.filter(paper => 
      paper.status === 'under review' && 
      !reviewedPaperIds.includes(paper.id)
    );
  };

  // Get all papers (for admin)
  const getAllPapers = () => {
    return papers;
  };

  // Get reviews for a specific paper
  const getReviewsByPaper = (paperId: number) => {
    return reviews.filter(review => review.paperId === paperId);
  };

  // Get a paper by ID
  const getPaperById = (paperId: number) => {
    return papers.find(paper => paper.id === paperId);
  };

  const value = {
    papers,
    reviews,
    submitPaper,
    assignReviewer,
    submitReview,
    updatePaperStatus,
    getPapersByAuthor,
    getPapersForReviewer,
    getAllPapers,
    getReviewsByPaper,
    getPaperById
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
