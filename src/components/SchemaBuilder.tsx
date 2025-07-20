import React, { useEffect } from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "./common/Card";
import { Button } from "./common/Button";
import { Badge } from "./common/Badge";
import { Input } from "./common/Input";
import {
  Plus,
  Code,
  Wrench,
  Sparkles,
  Save,
  RotateCcw,
} from "lucide-react";
import { FieldItem } from "./FieldItem";
import { SchemaField } from "../types/schema";
import { useState } from "react";

interface SchemaBuilderProps {
  onSchemaChange: (fields: SchemaField[]) => void;
  currentSchema: Record<string, any>;
  onSubmit: (objectName: string, schema: Record<string, any>) => void;
  onReset: () => void;
}

export const SchemaBuilder: React.FC<SchemaBuilderProps> = ({
  onSchemaChange,
  currentSchema,
  onSubmit,
  onReset,
}) => {
  const [objectName, setObjectName] = useState("");

  const methods = useForm({
    defaultValues: {
      fields: [] as SchemaField[],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "fields",
  });

  const watchedFields = methods.watch("fields");

  useEffect(() => {
    onSchemaChange(watchedFields);
  }, [watchedFields, onSchemaChange]);

  const addField = () => {
    append({
      id: `field_${Date.now()}_${Math.random()}`,
      name: "",
      type: "string",
      value: "",
      children: [],
    });
  };

  const handleSubmit = () => {
    if (!objectName.trim()) {
      alert("Please enter an object name");
      return;
    }

    if (Object.keys(currentSchema).length === 0) {
      alert("Please add at least one field");
      return;
    }

    onSubmit(objectName, currentSchema);
    setObjectName("");
  };

  const handleReset = () => {
    methods.reset({ fields: [] });
    setObjectName("");
    onReset();
  };

  return (
    <FormProvider {...methods}>
      <Card className="h-full border-2 border-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-800 dark:to-purple-800 shadow-xl">
        <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Schema Builder
              </span>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 dark:from-blue-900 dark:to-purple-900 dark:text-blue-300">
                <Sparkles className="w-3 h-3 mr-1" />
                Interactive
              </Badge>
              <Button
                type="button"
                onClick={addField}
                className="gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 shadow-lg transition-all duration-200 hover:scale-105">
                <Plus size={16} />
                Add Field
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Object Name Input */}
          <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg border-2 border-dashed border-blue-200 dark:border-blue-700">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Object Name
            </label>
            <Input
              value={objectName}
              onChange={(e) => setObjectName(e.target.value)}
              placeholder="Enter object name (e.g., User, Product, etc.)"
              className="font-medium"
            />
          </div>

          <div className="space-y-4 h-[calc(100vh-20rem)] overflow-auto pr-2 py-2">
            {fields.length === 0 ? (
              <div className="text-center py-16">
                <div className="mb-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full flex items-center justify-center mb-4">
                    <Code className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-3">
                  No fields added yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                  Start building your JSON schema by adding your first field
                </p>
                <Button
                  onClick={addField}
                  className="gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 shadow-lg transition-all duration-200 hover:scale-105 px-6 py-3">
                  <Plus size={16} />
                  Add Your First Field
                </Button>
              </div>
            ) : (
              fields.map((field, index) => (
                <FieldItem
                  key={field.id}
                  field={field as SchemaField}
                  index={index}
                  onRemove={() => remove(index)}
                  basePath="fields"
                />
              ))
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-4 pt-4 border-t-2 border-dashed border-gray-200 dark:border-gray-700">
            <div className="flex gap-3">
              <Button
                onClick={handleSubmit}
                disabled={
                  Object.keys(currentSchema).length === 0 || !objectName.trim()
                }
                className="flex-1 gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 shadow-lg transition-all duration-200 hover:scale-105">
                <Save size={16} />
                Submit & Save Object
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="gap-2 border-2 border-orange-200 text-orange-600 hover:bg-orange-50 dark:border-orange-700 dark:text-orange-400 dark:hover:bg-orange-950">
                <RotateCcw size={16} />
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </FormProvider>
  );
};
