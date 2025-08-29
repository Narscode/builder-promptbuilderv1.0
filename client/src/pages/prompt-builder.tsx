import React, { useState, useEffect } from "react";
import { Check, X, Brain, Lightbulb, Target, FileText, Wand2, Sparkles, Copy, ExternalLink, ChevronRight, ChevronLeft, Loader2, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/navbar";

interface PromptTemplate {
  id: string;
  title: string;
  icon: string;
  description: string;
  category: string;
  persona: string;
  task: string;
  context: string;
  format: string;
}

const promptTemplates: PromptTemplate[] = [
  {
    id: "fact-checker",
    title: "Fact-Check a News Article",
    icon: "🔍",
    description: "Verify claims and identify potential misinformation",
    category: "Media Literacy",
    persona: "Act as a professional journalist and fact-checker with expertise in media verification.",
    task: "Analyze the following article for accuracy and identify any potential misinformation or misleading claims.",
    context: "Paste the full article text here...",
    format: "Provide a bulleted list of verifiable facts, a list of claims that need further investigation, and a concluding summary of your findings."
  },
  {
    id: "study-guide",
    title: "Create a Study Guide",
    icon: "📚",
    description: "Transform content into structured learning materials",
    category: "Education",
    persona: "Act as an experienced educator and curriculum designer.",
    task: "Create a comprehensive study guide from the provided material.",
    context: "Paste your learning material here...",
    format: "Organize into key concepts, important definitions, practice questions, and summary points."
  },
  {
    id: "social-media",
    title: "Draft a Social Media Post",
    icon: "📱",
    description: "Create engaging content for social platforms",
    category: "Content Creation",
    persona: "Act as a social media content strategist with expertise in audience engagement.",
    task: "Create an engaging social media post that promotes the following content.",
    context: "Describe your content or paste the material here...",
    format: "Include a catchy headline, engaging body text, relevant hashtags, and a clear call-to-action."
  },
  {
    id: "code-review",
    title: "Review Code Quality",
    icon: "💻",
    description: "Analyze code for improvements and best practices",
    category: "Development",
    persona: "Act as a senior software engineer with expertise in code quality and best practices.",
    task: "Review the following code for potential improvements, bugs, and adherence to best practices.",
    context: "Paste your code here...",
    format: "Provide specific feedback on code quality, suggest improvements, identify potential issues, and rate overall code quality."
  },
  {
    id: "email-writer",
    title: "Professional Email Writer",
    icon: "📧",
    description: "Craft professional and effective emails",
    category: "Communication",
    persona: "Act as a professional communication specialist with expertise in business correspondence.",
    task: "Compose a professional email based on the provided context and requirements.",
    context: "Describe the situation, recipient, and purpose of the email...",
    format: "Include appropriate subject line, professional greeting, clear body paragraphs, and proper closing."
  },
  {
    id: "research-analyst",
    title: "Research Analysis",
    icon: "🔬",
    description: "Analyze and synthesize research findings",
    category: "Research",
    persona: "Act as a research analyst with expertise in data interpretation and evidence evaluation.",
    task: "Analyze the provided research data and extract key insights and patterns.",
    context: "Paste your research data or findings here...",
    format: "Present findings in executive summary, key insights, supporting evidence, and actionable recommendations."
  }
];

export default function PromptBuilderPage() {
  const [showTour, setShowTour] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [tourStep, setTourStep] = useState(0);
  const [showTemplates, setShowTemplates] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const { toast } = useToast();

  const [promptData, setPromptData] = useState({
    persona: "",
    task: "",
    context: "",
    format: ""
  });

  const steps = [
    {
      title: "Define the Persona",
      description: "Tell the AI what role to play for better context and expertise",
      field: "persona",
      placeholder: "e.g., Act as a financial advisor with 10 years of experience...",
      icon: Target,
      suggestions: [
        "Professional expert",
        "Creative writer",
        "Technical specialist",
        "Educational tutor",
        "Research analyst"
      ]
    },
    {
      title: "Specify the Task",
      description: "Give the AI a clear, specific task to perform",
      field: "task",
      placeholder: "e.g., Analyze the financial risks in the following investment proposal...",
      icon: Wand2,
      suggestions: [
        "Analyze and evaluate",
        "Create and generate",
        "Summarize and explain",
        "Compare and contrast",
        "Provide recommendations"
      ]
    },
    {
      title: "Provide Context",
      description: "Include all necessary background information and data",
      field: "context",
      placeholder: "Paste your content, data, or background information here...",
      icon: FileText,
      suggestions: [
        "Include full source text",
        "Add relevant background",
        "Specify target audience",
        "Mention constraints",
        "Include examples"
      ]
    },
    {
      title: "Define the Format",
      description: "Specify how you want the AI's response to be structured",
      field: "format",
      placeholder: "e.g., Provide a bulleted list with risk assessment scores...",
      icon: Brain,
      suggestions: [
        "Bulleted list",
        "Numbered steps",
        "Table format",
        "Paragraph form",
        "Q&A format"
      ]
    }
  ];

  const tourMessages = [
    {
      title: "Welcome to the Prompt Builder!",
      content: "Let's take a quick tour to show you how to create powerful AI prompts that get better results."
    },
    {
      title: "Persona - Set the Expert Role",
      content: "Tell the AI what role to play (e.g., 'Act as a financial advisor'). This gives context and expertise to responses."
    },
    {
      title: "Task - Define Clear Objectives",
      content: "Give the AI a clear task to perform (e.g., 'Summarize the article'). Be specific about what you want."
    },
    {
      title: "Context - Provide Complete Information",
      content: "Include all necessary background info for the task. More context leads to better, more accurate responses."
    },
    {
      title: "Format - Structure the Response",
      content: "Specify how you want the AI's response to be structured (e.g., 'Use a bulleted list'). This ensures useful output."
    },
    {
      title: "You're All Set!",
      content: "Now you know how to build effective prompts. Let's create your first structured prompt together!"
    }
  ];

  const generateFinalPrompt = () => {
    const parts = [];
    if (promptData.persona) parts.push(promptData.persona);
    if (promptData.task) parts.push(promptData.task);
    if (promptData.context) parts.push(`Context: ${promptData.context}`);
    if (promptData.format) parts.push(`Please respond in the following format: ${promptData.format}`);
    return parts.join('\n\n');
  };

  const generateGenericPrompt = () => {
    if (promptData.task && promptData.context) {
      return `${promptData.task}\n\n${promptData.context}`;
    }
    return "Please help me with this task.";
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    // Simulate analysis time
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsAnalyzing(false);
    setShowResults(true);
  };

  const handleCopyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    setCopySuccess(true);
    toast({
      title: "Copied to clipboard!",
      description: "Your prompt is ready to use in any AI tool.",
    });
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleTemplateSelect = (template: PromptTemplate) => {
    setPromptData({
      persona: template.persona,
      task: template.task,
      context: template.context,
      format: template.format
    });
    setShowTemplates(false);
    setCurrentStep(0);
  };

  const handleSuggestionClick = (suggestion: string, field: string) => {
    const currentValue = promptData[field as keyof typeof promptData];
    const newValue = currentValue ? `${currentValue} ${suggestion}` : suggestion;
    setPromptData(prev => ({ ...prev, [field]: newValue }));
  };

  const canProceed = () => {
    const currentField = steps[currentStep].field;
    return promptData[currentField as keyof typeof promptData].trim().length > 0;
  };

  const isCompleted = () => {
    return Object.values(promptData).every(value => value.trim().length > 0);
  };

  if (showTour) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
          <Card className="max-w-lg mx-4">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-xl">{tourMessages[tourStep].title}</CardTitle>
              <CardDescription className="text-base">
                {tourMessages[tourStep].content}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={() => tourStep > 0 ? setTourStep(tourStep - 1) : setShowTour(false)}
                >
                  {tourStep > 0 ? "Previous" : "Skip Tour"}
                </Button>
                
                <div className="flex space-x-2">
                  {tourMessages.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === tourStep ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  ))}
                </div>

                <Button
                  onClick={() => {
                    if (tourStep < tourMessages.length - 1) {
                      setTourStep(tourStep + 1);
                    } else {
                      setShowTour(false);
                    }
                  }}
                >
                  {tourStep < tourMessages.length - 1 ? "Next" : "Start Building"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
          <Card className="max-w-md mx-4">
            <CardContent className="text-center p-8">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Analyzing Your Prompt</h2>
              <div className="space-y-2 text-muted-foreground">
                <p>🔄 Analyzing your prompt structure...</p>
                <p>🤖 Generating comparison outputs...</p>
                <p>📊 Calculating impact differences...</p>
                <p>✨ Preparing your results...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (showResults) {
    const structuredPrompt = generateFinalPrompt();
    const genericPrompt = generateGenericPrompt();

    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Impact Analysis Complete!</h1>
            <p className="text-muted-foreground text-lg">
              See how your structured prompt delivers superior results
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Structured Prompt Output */}
            <Card className="border-green-500/30 bg-green-500/5">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <CardTitle className="text-green-700 dark:text-green-400">
                    Your Prompt's Output
                  </CardTitle>
                </div>
                <CardDescription>Enhanced with structure and context</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 rounded-lg p-4 mb-4">
                  <code className="text-sm whitespace-pre-wrap">{structuredPrompt}</code>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-green-600">
                    <Check className="w-4 h-4" />
                    <span>Clear role definition and expertise</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <Check className="w-4 h-4" />
                    <span>Specific task instructions</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <Check className="w-4 h-4" />
                    <span>Complete context provided</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <Check className="w-4 h-4" />
                    <span>Structured output format</span>
                  </div>
                </div>
                <Button 
                  className="w-full mt-4" 
                  onClick={() => handleCopyPrompt(structuredPrompt)}
                  data-testid="copy-structured-prompt"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Enhanced Prompt
                </Button>
              </CardContent>
            </Card>

            {/* Generic Prompt Output */}
            <Card className="border-orange-500/30 bg-orange-500/5">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <X className="w-5 h-5 text-orange-500" />
                  <CardTitle className="text-orange-700 dark:text-orange-400">
                    Generic Prompt's Output
                  </CardTitle>
                </div>
                <CardDescription>Basic prompt without structure</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 rounded-lg p-4 mb-4">
                  <code className="text-sm whitespace-pre-wrap">{genericPrompt}</code>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-orange-600">
                    <X className="w-4 h-4" />
                    <span>No role or expertise specified</span>
                  </div>
                  <div className="flex items-center gap-2 text-orange-600">
                    <X className="w-4 h-4" />
                    <span>Vague task description</span>
                  </div>
                  <div className="flex items-center gap-2 text-orange-600">
                    <X className="w-4 h-4" />
                    <span>Limited context</span>
                  </div>
                  <div className="flex items-center gap-2 text-orange-600">
                    <X className="w-4 h-4" />
                    <span>Unstructured output</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Celebration Section */}
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30">
            <CardContent className="text-center p-8">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-4">You're a Master Prompter! 🎉</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                You just saw how a well-crafted prompt leads to superior results. 
                This is a crucial skill for navigating the AI-powered world effectively.
              </p>
              
              <div className="grid md:grid-cols-3 gap-4">
                <Button 
                  size="lg" 
                  onClick={() => handleCopyPrompt(structuredPrompt)}
                  data-testid="use-prompt-button"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Use This Prompt
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => {
                    setShowResults(false);
                    setPromptData({ persona: "", task: "", context: "", format: "" });
                    setCurrentStep(0);
                    setShowTemplates(true);
                  }}
                  data-testid="build-another-button"
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  Build Another
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => window.open('https://twitter.com/intent/tweet?text=I just learned how to write better AI prompts! It\'s incredible how much of a difference structure makes. %23AIPrompts %23MediaLiteracy', '_blank')}
                  data-testid="share-success-button"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Share Success
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            AI Prompt Builder
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
            Create powerful, structured prompts that get better AI results. Learn the difference between generic and expert-level prompting.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => setShowTour(true)}
              data-testid="start-tour-button"
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              Start the Tour
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => setShowTemplates(false)}
              data-testid="skip-to-builder-button"
            >
              Skip to Builder
            </Button>
          </div>
        </div>

        {showTemplates ? (
          /* Template Library */
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">Start from a Template</h2>
              <p className="text-muted-foreground">
                Choose a template to see how structured prompts work, or start from scratch.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {promptTemplates.map((template) => (
                <Card 
                  key={template.id} 
                  className="cursor-pointer hover:shadow-lg transition-all hover:border-primary/50"
                  onClick={() => handleTemplateSelect(template)}
                  data-testid={`template-${template.id}`}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-2xl">{template.icon}</div>
                      <div>
                        <CardTitle className="text-lg">{template.title}</CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          {template.category}
                        </Badge>
                      </div>
                    </div>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setShowTemplates(false)}
                data-testid="manual-builder-button"
              >
                <Wand2 className="w-4 h-4 mr-2" />
                Start Manual Builder
              </Button>
            </div>
          </div>
        ) : (
          /* Progressive Builder */
          <div className="max-w-4xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                {steps.map((step, index) => {
                  const StepIcon = step.icon;
                  const isActive = index === currentStep;
                  const isCompleted = promptData[step.field as keyof typeof promptData].trim().length > 0;
                  
                  return (
                    <div key={index} className="flex flex-col items-center relative">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                        isActive 
                          ? 'bg-primary border-primary text-primary-foreground' 
                          : isCompleted 
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'bg-muted border-muted-foreground/30'
                      }`}>
                        {isCompleted && !isActive ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <StepIcon className="w-5 h-5" />
                        )}
                      </div>
                      <span className={`text-xs mt-2 text-center max-w-20 ${
                        isActive ? 'text-primary font-medium' : 'text-muted-foreground'
                      }`}>
                        {step.title.split(' ')[0]}
                      </span>
                      {index < steps.length - 1 && (
                        <div className={`absolute top-6 left-12 w-12 md:w-24 h-0.5 ${
                          isCompleted ? 'bg-green-500' : 'bg-muted-foreground/30'
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Current Step */}
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  {React.createElement(steps[currentStep].icon, { className: "w-8 h-8 text-primary" })}
                </div>
                <CardTitle className="text-2xl">{steps[currentStep].title}</CardTitle>
                <CardDescription className="text-lg">
                  {steps[currentStep].description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Textarea
                    placeholder={steps[currentStep].placeholder}
                    value={promptData[steps[currentStep].field as keyof typeof promptData]}
                    onChange={(e) => setPromptData(prev => ({
                      ...prev,
                      [steps[currentStep].field]: e.target.value
                    }))}
                    className="min-h-32"
                    data-testid={`input-${steps[currentStep].field}`}
                  />
                </div>

                {/* Suggestions */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Quick suggestions:</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {steps[currentStep].suggestions.map((suggestion, index) => (
                      <Badge 
                        key={index}
                        variant="outline" 
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                        onClick={() => handleSuggestionClick(suggestion, steps[currentStep].field)}
                        data-testid={`suggestion-${suggestion.replace(/\s+/g, '-').toLowerCase()}`}
                      >
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between pt-6">
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (currentStep > 0) {
                        setCurrentStep(currentStep - 1);
                      } else {
                        setShowTemplates(true);
                      }
                    }}
                    data-testid="step-back-button"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    {currentStep > 0 ? 'Previous' : 'Back to Templates'}
                  </Button>

                  {currentStep < steps.length - 1 ? (
                    <Button
                      onClick={() => setCurrentStep(currentStep + 1)}
                      disabled={!canProceed()}
                      data-testid="step-next-button"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleAnalyze}
                      disabled={!isCompleted()}
                      size="lg"
                      data-testid="analyze-impact-button"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Analyze Impact
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Live Preview */}
            {Object.values(promptData).some(value => value.trim().length > 0) && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Live Prompt Preview</CardTitle>
                  <CardDescription>See your prompt structure in real-time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <code className="text-sm whitespace-pre-wrap">{generateFinalPrompt()}</code>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>

      {/* Copy Success Notification */}
      {copySuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-in slide-in-from-right">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Copied to clipboard!</span>
          </div>
        </div>
      )}
    </div>
  );
}