"use client";

import { AnalysisResponse } from '@/types/api';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle, Lightbulb } from "lucide-react";

interface AnalysisResultsProps {
  result: AnalysisResponse;
}

export default function AnalysisResults({ result }: AnalysisResultsProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500 dark:bg-green-600";
    if (score >= 60) return "bg-yellow-500 dark:bg-yellow-600";
    return "bg-red-500 dark:bg-red-600";
  };

  const getScoreText = (score: number) => {
    if (score >= 80) return "Excellent Match";
    if (score >= 60) return "Good Match";
    return "Needs Improvement";
  };

  return (
    <div className="space-y-6">
      {/* Score Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Resume Match Score</span>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${getScoreColor(result.score)}`}></div>
              <span className="text-2xl font-bold">{result.score}%</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-300 ${getScoreColor(result.score)}`}
              style={{ width: `${result.score}%` }}
            ></div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">{getScoreText(result.score)}</p>
        </CardContent>
      </Card>

      {/* Skills Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Matching Skills */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              Matching Skills ({result.matching_skills.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {result.matching_skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {result.matching_skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                    {skill}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No matching skills found</p>
            )}
          </CardContent>
        </Card>

        {/* Missing Skills */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <XCircle className="h-5 w-5" />
              Missing Skills ({result.missing_skills.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {result.missing_skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {result.missing_skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                    {skill}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No missing skills identified</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Missing Qualifications */}
      {result.missing_qualifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <AlertCircle className="h-5 w-5" />
              Missing Qualifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.missing_qualifications.map((qualification, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-orange-500 dark:bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm">{qualification}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-600">
            <Lightbulb className="h-5 w-5" />
            Suggestions for Improvement
          </CardTitle>
        </CardHeader>
        <CardContent>
          {result.suggestions.length > 0 ? (
            <ul className="space-y-3">
              {result.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <span className="text-sm">{suggestion}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-sm">No specific suggestions available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
