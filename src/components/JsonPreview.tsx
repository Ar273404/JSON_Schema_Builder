import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./common/Card";
import { Badge } from "./common/Badge";
import { FileJson, Sparkles } from "lucide-react";

interface JsonPreviewProps {
  schema: Record<string, any>;
}

export const JsonPreview: React.FC<JsonPreviewProps> = ({ schema }) => {
  const formatJson = (obj: any): string => {
    // Always show the object structure, even if empty
    return JSON.stringify(obj, null, 2);
  };

  const jsonOutput = formatJson(schema);

  return (
    <Card className="h-full border-2 border-gradient-to-r from-emerald-200 to-blue-200 dark:from-emerald-800 dark:to-blue-800 shadow-xl">
      <CardHeader className="pb-4 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950 dark:to-blue-950 rounded-t-lg">
        <CardTitle className="text-xl font-bold flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg">
              <FileJson className="w-5 h-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              JSON Schema Preview
            </span>
          </div>
          <Badge
            variant="secondary"
            className="bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-700 dark:from-emerald-900 dark:to-blue-900 dark:text-emerald-300">
            <Sparkles className="w-3 h-3 mr-1" />
            Live Preview
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 h-[calc(100vh-12rem)] overflow-auto border-t">
          {Object.keys(schema).length > 0 ? (
            <div className="p-6">
              <div className="bg-white dark:bg-slate-800 rounded-lg border-2 border-dashed border-emerald-200 dark:border-emerald-700 p-4 shadow-inner">
                <pre className="text-sm font-mono text-slate-700 dark:text-slate-300 whitespace-pre-wrap break-words leading-relaxed">
                  {jsonOutput}
                </pre>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-8">
                <div className="mb-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-r from-emerald-100 to-blue-100 dark:from-emerald-900 dark:to-blue-900 rounded-full flex items-center justify-center mb-4">
                    <FileJson className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700 p-6 max-w-xs mx-auto shadow-sm">
                  <pre className="text-lg font-mono text-gray-600 dark:text-gray-400">
                    {`{}`}
                  </pre>
                </div>
                <p className="text-gray-500 dark:text-gray-400 mt-4 text-sm">
                  Start adding fields to see your JSON schema
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
