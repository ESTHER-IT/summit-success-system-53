
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, FileText, ArrowLeft } from 'lucide-react';

const Winner = () => {
  // In a real app, this would be fetched from the server
  const winners = [
    {
      id: 1,
      title: "Advances in Machine Learning",
      author: "Dr. John Smith",
      institution: "Stanford University",
      abstract: "This paper explores recent advances in machine learning techniques and their applications in various domains such as healthcare, finance, and education."
    }
  ];
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <Award size={48} className="mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold">Conference Winners</h1>
          <p className="mt-2 text-lg max-w-2xl mx-auto">
            Recognizing excellence in research and innovation
          </p>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-12">
        <Link to="/" className="inline-flex items-center text-primary hover:underline mb-8">
          <ArrowLeft size={16} className="mr-1" />
          Back to Home
        </Link>
        
        <div className="max-w-4xl mx-auto">
          {winners.length > 0 ? (
            <div className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-2xl font-bold mb-2">Best Paper Award</h2>
                <p className="text-gray-600">
                  The Best Paper Award recognizes outstanding research contributions 
                  presented at the conference.
                </p>
              </div>
              
              {winners.map((winner) => (
                <Card key={winner.id} className="border-2 border-amber-200">
                  <CardHeader className="bg-amber-50 border-b border-amber-100">
                    <CardTitle className="flex items-start justify-between">
                      <div>
                        <span className="text-xl">{winner.title}</span>
                        <div className="mt-2 font-normal text-base text-gray-600">
                          {winner.author}, {winner.institution}
                        </div>
                      </div>
                      <Award size={24} className="text-amber-500" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-2">Abstract</h3>
                    <p className="text-gray-700 mb-6">{winner.abstract}</p>
                    <Button variant="outline" className="flex items-center">
                      <FileText size={16} className="mr-2" />
                      View Full Paper
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm">
              <Award size={48} className="mx-auto mb-4 text-gray-300" />
              <h2 className="text-2xl font-bold mb-2">No Winners Yet</h2>
              <p className="text-gray-600 mb-8">
                The winners of the conference have not been declared yet.
                Check back soon for updates!
              </p>
              <Button variant="outline" asChild>
                <Link to="/">Return to Home</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <footer className="bg-white py-8 border-t">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} Conference Management System</p>
          <p className="mt-2">All rights reserved</p>
        </div>
      </footer>
    </div>
  );
};

export default Winner;
