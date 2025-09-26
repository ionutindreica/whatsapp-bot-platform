// src/pages/TrainingAnalytics.tsx - Training Analytics Dashboard
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  TrendingUp, 
  MessageSquare, 
  Star, 
  Download, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Target
} from 'lucide-react';

interface TrainingData {
  totalConversations: number;
  averageConfidence: number;
  feedbackStats: {
    positive: number;
    negative: number;
    neutral: number;
  };
  improvementAreas: Array<{
    type: string;
    count: number;
    suggestion: string;
  }>;
  patterns: Array<{
    type: string;
    query: string;
    response: string;
    suggestedImprovement: string;
    timestamp: string;
  }>;
  recentFeedback: Array<{
    conversationId: string;
    rating: number;
    feedback: string;
    improvement: string;
    timestamp: string;
  }>;
}

const TrainingAnalytics = () => {
  const [trainingData, setTrainingData] = useState<TrainingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [exportData, setExportData] = useState(null);

  useEffect(() => {
    fetchTrainingData();
  }, []);

  const fetchTrainingData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/rag/training/analytics');
      if (response.ok) {
        const data = await response.json();
        setTrainingData(data);
      }
    } catch (error) {
      console.error('Error fetching training data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportTrainingData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/rag/training/export');
      if (response.ok) {
        const data = await response.json();
        setExportData(data);
        
        // Download as JSON file
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `training-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error exporting training data:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Brain className="w-8 h-8 animate-spin mx-auto mb-2" />
          <p>Loading training analytics...</p>
        </div>
      </div>
    );
  }

  if (!trainingData) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">No Training Data Available</h3>
        <p className="text-muted-foreground">Start testing your bot to see analytics here.</p>
      </div>
    );
  }

  const totalFeedback = trainingData.feedbackStats.positive + trainingData.feedbackStats.negative + trainingData.feedbackStats.neutral;
  const positiveRate = totalFeedback > 0 ? (trainingData.feedbackStats.positive / totalFeedback) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Training Analytics</h1>
          <p className="text-muted-foreground">Monitor and improve your bot's performance</p>
        </div>
        <Button onClick={exportTrainingData} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Data
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trainingData.totalConversations}</div>
            <p className="text-xs text-muted-foreground">All bot interactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Confidence</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(trainingData.averageConfidence * 100).toFixed(1)}%</div>
            <Progress value={trainingData.averageConfidence * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Positive Feedback</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trainingData.feedbackStats.positive}</div>
            <p className="text-xs text-muted-foreground">
              {positiveRate.toFixed(1)}% of total feedback
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Improvement Areas</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trainingData.improvementAreas.length}</div>
            <p className="text-xs text-muted-foreground">Areas needing attention</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="feedback" className="space-y-4">
        <TabsList>
          <TabsTrigger value="feedback">Feedback Analysis</TabsTrigger>
          <TabsTrigger value="patterns">Patterns & Issues</TabsTrigger>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="feedback" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feedback Distribution</CardTitle>
              <CardDescription>User feedback breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Positive (4-5 stars)</span>
                  </div>
                  <Badge variant="default">{trainingData.feedbackStats.positive}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-yellow-500" />
                    <span>Neutral (3 stars)</span>
                  </div>
                  <Badge variant="secondary">{trainingData.feedbackStats.neutral}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span>Negative (1-2 stars)</span>
                  </div>
                  <Badge variant="destructive">{trainingData.feedbackStats.negative}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Improvement Patterns</CardTitle>
              <CardDescription>Areas that need attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {trainingData.improvementAreas.map((area, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{area.type}</div>
                      <div className="text-sm text-muted-foreground">{area.suggestion}</div>
                    </div>
                    <Badge variant="outline">{area.count} occurrences</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Feedback</CardTitle>
              <CardDescription>Latest user feedback and suggestions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {trainingData.recentFeedback.map((feedback, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        <span className="font-medium">{feedback.rating}/5</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(feedback.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    {feedback.feedback && (
                      <div className="text-sm text-muted-foreground mb-2">
                        "{feedback.feedback}"
                      </div>
                    )}
                    {feedback.improvement && (
                      <div className="text-sm">
                        <strong>Suggestion:</strong> {feedback.improvement}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrainingAnalytics;
