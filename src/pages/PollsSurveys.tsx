import React, { useState } from "react";
import BackToDashboard from "@/components/BackToDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Users, 
  Clock, 
  CheckCircle,
  MessageSquare,
  Star,
  FileText,
  Target,
  Calendar,
  TrendingUp
} from "lucide-react";

const PollsSurveys = () => {
  const [activeTab, setActiveTab] = useState("create");
  const [pollType, setPollType] = useState("SINGLE_CHOICE");
  
  // New poll form
  const [newPoll, setNewPoll] = useState({
    title: "",
    question: "",
    type: "SINGLE_CHOICE",
    options: ["", ""],
    expiresAt: "",
    segment: ""
  });

  // Sample polls data
  const polls = [
    {
      id: "1",
      title: "Product Feature Survey",
      question: "Which new feature would you like to see most?",
      type: "SINGLE_CHOICE",
      status: "ACTIVE",
      responses: 156,
      totalUsers: 320,
      createdAt: "2024-01-15",
      expiresAt: "2024-01-25",
      options: [
        { text: "Voice Messages", votes: 45, percentage: 29 },
        { text: "Video Calls", votes: 67, percentage: 43 },
        { text: "File Sharing", votes: 32, percentage: 21 },
        { text: "Group Chats", votes: 12, percentage: 8 }
      ]
    },
    {
      id: "2",
      title: "Service Rating",
      question: "How would you rate our customer service?",
      type: "RATING",
      status: "ACTIVE",
      responses: 89,
      totalUsers: 150,
      createdAt: "2024-01-20",
      expiresAt: "2024-01-30",
      options: [
        { text: "⭐⭐⭐⭐⭐", votes: 45, percentage: 51 },
        { text: "⭐⭐⭐⭐", votes: 28, percentage: 31 },
        { text: "⭐⭐⭐", votes: 12, percentage: 13 },
        { text: "⭐⭐", votes: 3, percentage: 3 },
        { text: "⭐", votes: 1, percentage: 1 }
      ]
    },
    {
      id: "3",
      title: "Event Preferences",
      question: "What types of events interest you? (Select all that apply)",
      type: "MULTIPLE_CHOICE",
      status: "EXPIRED",
      responses: 234,
      totalUsers: 400,
      createdAt: "2024-01-10",
      expiresAt: "2024-01-20",
      options: [
        { text: "Webinars", votes: 156, percentage: 67 },
        { text: "Workshops", votes: 89, percentage: 38 },
        { text: "Networking Events", votes: 67, percentage: 29 },
        { text: "Product Demos", votes: 45, percentage: 19 }
      ]
    }
  ];

  const segments = [
    { id: "all", name: "All Users", count: 1250 },
    { id: "premium", name: "Premium Users", count: 320 },
    { id: "new", name: "New Users", count: 150 },
    { id: "active", name: "Active Users", count: 890 }
  ];

  const handleAddOption = () => {
    setNewPoll(prev => ({
      ...prev,
      options: [...prev.options, ""]
    }));
  };

  const handleRemoveOption = (index: number) => {
    if (newPoll.options.length > 2) {
      setNewPoll(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index)
      }));
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    setNewPoll(prev => ({
      ...prev,
      options: prev.options.map((option, i) => i === index ? value : option)
    }));
  };

  const handleCreatePoll = () => {
    if (!newPoll.title || !newPoll.question || newPoll.options.some(opt => !opt.trim())) {
      alert("Please fill in all required fields");
      return;
    }

    console.log("Creating poll:", newPoll);
    alert("Poll created successfully!");
    
    // Reset form
    setNewPoll({
      title: "",
      question: "",
      type: "SINGLE_CHOICE",
      options: ["", ""],
      expiresAt: "",
      segment: ""
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE": return "bg-green-100 text-green-800";
      case "EXPIRED": return "bg-gray-100 text-gray-800";
      case "INACTIVE": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "SINGLE_CHOICE": return <CheckCircle className="w-4 h-4" />;
      case "MULTIPLE_CHOICE": return <CheckCircle className="w-4 h-4" />;
      case "RATING": return <Star className="w-4 h-4" />;
      case "TEXT": return <FileText className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <BackToDashboard />
          <div className="flex items-center justify-between mt-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-purple-600" />
                Polls & Surveys
              </h1>
              <p className="text-gray-600 mt-2">
                Create interactive polls and surveys to gather feedback from your users
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Eye className="mr-2 w-4 h-4" />
                View Results
              </Button>
              <Button>
                <Plus className="mr-2 w-4 h-4" />
                New Poll
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Poll
            </TabsTrigger>
            <TabsTrigger value="manage" className="flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Manage Polls
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Create Poll Tab */}
          <TabsContent value="create" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Create New Poll</CardTitle>
                    <CardDescription>
                      Design interactive polls to engage with your audience
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Poll Title</label>
                      <Input
                        placeholder="Enter poll title..."
                        value={newPoll.title}
                        onChange={(e) => setNewPoll(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Question</label>
                      <Textarea
                        placeholder="What would you like to ask your audience?"
                        rows={3}
                        value={newPoll.question}
                        onChange={(e) => setNewPoll(prev => ({ ...prev, question: e.target.value }))}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Poll Type</label>
                        <Select value={newPoll.type} onValueChange={setPollType}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SINGLE_CHOICE">Single Choice</SelectItem>
                            <SelectItem value="MULTIPLE_CHOICE">Multiple Choice</SelectItem>
                            <SelectItem value="RATING">Rating (1-5 stars)</SelectItem>
                            <SelectItem value="TEXT">Text Response</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Target Segment</label>
                        <Select value={newPoll.segment} onValueChange={(value) => setNewPoll(prev => ({ ...prev, segment: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select segment..." />
                          </SelectTrigger>
                          <SelectContent>
                            {segments.map((segment) => (
                              <SelectItem key={segment.id} value={segment.id}>
                                {segment.name} ({segment.count} users)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {pollType !== "TEXT" && (
                      <div>
                        <label className="text-sm font-medium mb-2 block">Answer Options</label>
                        <div className="space-y-3">
                          {newPoll.options.map((option, index) => (
                            <div key={index} className="flex gap-2">
                              <Input
                                placeholder={`Option ${index + 1}`}
                                value={option}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                              />
                              {newPoll.options.length > 2 && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRemoveOption(index)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleAddOption}
                            className="w-full"
                          >
                            <Plus className="mr-2 w-4 h-4" />
                            Add Option
                          </Button>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="text-sm font-medium mb-2 block">Expiration Date (Optional)</label>
                      <Input
                        type="datetime-local"
                        value={newPoll.expiresAt}
                        onChange={(e) => setNewPoll(prev => ({ ...prev, expiresAt: e.target.value }))}
                      />
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleCreatePoll} className="flex-1">
                        <Plus className="mr-2 w-4 h-4" />
                        Create Poll
                      </Button>
                      <Button variant="outline">
                        <Eye className="mr-2 w-4 h-4" />
                        Preview
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Poll Preview */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Preview</CardTitle>
                    <CardDescription>How your poll will appear to users</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-lg p-4 bg-white">
                      <h3 className="font-medium mb-2">{newPoll.title || "Poll Title"}</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {newPoll.question || "Your question will appear here..."}
                      </p>
                      
                      {pollType !== "TEXT" && (
                        <div className="space-y-2">
                          {newPoll.options.map((option, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 border rounded">
                              <div className="w-4 h-4 border rounded"></div>
                              <span className="text-sm">{option || `Option ${index + 1}`}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {pollType === "TEXT" && (
                        <Textarea placeholder="User will type their response here..." rows={3} disabled />
                      )}
                      
                      <Button className="w-full mt-4" size="sm">
                        Submit Response
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Manage Polls Tab */}
          <TabsContent value="manage" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {polls.map((poll) => (
                <Card key={poll.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(poll.type)}
                        <CardTitle className="text-base">{poll.title}</CardTitle>
                      </div>
                      <Badge className={getStatusColor(poll.status)}>
                        {poll.status}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {poll.question}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {poll.options.slice(0, 2).map((option, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="truncate">{option.text}</span>
                            <span>{option.percentage}%</span>
                          </div>
                          <Progress value={option.percentage} className="h-2" />
                        </div>
                      ))}
                      {poll.options.length > 2 && (
                        <p className="text-xs text-gray-500">
                          +{poll.options.length - 2} more options
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {poll.responses}/{poll.totalUsers}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(poll.expiresAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="mr-1 w-3 h-3" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <BarChart3 className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Polls</p>
                      <p className="text-2xl font-bold text-gray-900">12</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Responses</p>
                      <p className="text-2xl font-bold text-gray-900">1,234</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Avg. Response Rate</p>
                      <p className="text-2xl font-bold text-gray-900">68%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Clock className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Active Polls</p>
                      <p className="text-2xl font-bold text-gray-900">5</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Poll Results</CardTitle>
                <CardDescription>Detailed analytics for your recent polls</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {polls.slice(0, 2).map((poll) => (
                    <div key={poll.id} className="border rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-medium">{poll.title}</h3>
                          <p className="text-sm text-gray-600">{poll.question}</p>
                        </div>
                        <Badge className={getStatusColor(poll.status)}>
                          {poll.status}
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        {poll.options.map((option, index) => (
                          <div key={index} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{option.text}</span>
                              <span className="font-medium">{option.votes} votes ({option.percentage}%)</span>
                            </div>
                            <Progress value={option.percentage} className="h-2" />
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t text-sm text-gray-500">
                        <span>{poll.responses} total responses</span>
                        <span>Created {new Date(poll.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PollsSurveys;
