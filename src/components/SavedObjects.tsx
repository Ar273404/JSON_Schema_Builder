import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./common/Card";
import { Button } from "./common/Button";
import { Badge } from "./common/Badge";
import { Input } from "./common/Input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./common/Dialog";
import {
  Database,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Package,
  Save,
  X,
} from "lucide-react";
import { SavedObject } from "../types/schema";

interface SavedObjectsProps {
  savedObjects: SavedObject[];
  onUpdate: (id: string, newName: string, newData: Record<string, any>) => void;
  onDelete: (id: string) => void;
}

export const SavedObjects: React.FC<SavedObjectsProps> = ({
  savedObjects,
  onUpdate,
  onDelete,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [, setViewingObject] = useState<SavedObject | null>(null); // ✅ FIXED

  const handleEdit = (obj: SavedObject) => {
    setEditingId(obj.id);
    setEditName(obj.name);
  };

  const handleSaveEdit = (obj: SavedObject) => {
    if (editName.trim()) {
      onUpdate(obj.id, editName.trim(), obj.data);
      setEditingId(null);
      setEditName("");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  };

  return (
    <Card className="h-full border-2 border-gradient-to-r from-indigo-200 to-cyan-200 dark:from-indigo-800 dark:to-cyan-800 shadow-xl">
      <CardHeader className="pb-4 bg-gradient-to-r from-indigo-50 to-cyan-50 dark:from-indigo-950 dark:to-cyan-950 rounded-t-lg">
        <CardTitle className="text-xl font-bold flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg">
            <Database className="w-5 h-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
            Saved Objects
          </span>
          <Badge
            variant="secondary"
            className="bg-gradient-to-r from-indigo-100 to-cyan-100 text-indigo-700 dark:from-indigo-900 dark:to-cyan-900 dark:text-indigo-300">
            {savedObjects.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 h-[calc(100vh-12rem)] overflow-auto pr-2 py-2">
          {savedObjects.length === 0 ? (
            <div className="text-center py-16">
              <div className="mb-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-r from-indigo-100 to-cyan-100 dark:from-indigo-900 dark:to-cyan-900 rounded-full flex items-center justify-center mb-4">
                  <Package className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-3">
                No saved objects yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                Create and submit your first JSON object to see it here
              </p>
            </div>
          ) : (
            savedObjects.map((obj) => (
              <Card
                key={obj.id}
                className="bg-gradient-to-br from-white to-indigo-50 dark:from-gray-800 dark:to-indigo-950 border-2 border-indigo-200 dark:border-indigo-700 shadow-md hover:shadow-lg transition-all duration-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    {editingId === obj.id ? (
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="flex-1 text-sm font-bold"
                          autoFocus
                        />
                        <Button
                          size="sm"
                          onClick={() => handleSaveEdit(obj)}
                          className="p-1 h-8 w-8 bg-green-500 hover:bg-green-600 text-white">
                          <Save size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancelEdit}
                          className="p-1 h-8 w-8">
                          <X size={14} />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div>
                          <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">
                            {obj.name}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <Calendar className="w-3 h-3" />
                            <span>Created: {formatDate(obj.createdAt)}</span>
                            {obj.updatedAt !== obj.createdAt && (
                              <span>
                                • Updated: {formatDate(obj.updatedAt)}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setViewingObject(obj)}
                                className="p-1 h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950">
                                <Eye size={14} />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>
                                  <div className="flex items-center gap-2">
                                    <Package className="w-5 h-5" />
                                    {obj.name}
                                  </div>
                                </DialogTitle>
                              </DialogHeader>
                              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border-2 border-dashed border-gray-200 dark:border-gray-700">
                                <pre className="text-sm font-mono text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
                                  {JSON.stringify(obj.data, null, 2)}
                                </pre>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(obj)}
                            className="p-1 h-8 w-8 text-orange-500 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-950">
                            <Edit size={14} />
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onDelete(obj.id)}
                            className="p-1 h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950">
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    <Badge variant="outline" className="text-xs">
                      {Object.keys(obj.data).length} field
                      {Object.keys(obj.data).length !== 1 ? "s" : ""}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
