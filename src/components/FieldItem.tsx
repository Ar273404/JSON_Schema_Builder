import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Card, CardContent } from "./common/Card";
import { Input } from "./common/Input";
import { Button } from "./common/Button";
import { Badge } from "./common/Badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./common/Select";
import {
  Trash2,
  Plus,
  ChevronDown,
  ChevronRight,
  Key,
  Type,
  Hash,
} from "lucide-react";
import { SchemaField } from "../types/schema";
import { useState } from "react";

interface FieldItemProps {
  field: SchemaField;
  index: number;
  onRemove: () => void;
  basePath: string;
  depth?: number;
}

export const FieldItem: React.FC<FieldItemProps> = ({
  field,
  index,
  onRemove,
  basePath,
  depth = 0,
}) => {
  const { register, watch, setValue } = useFormContext();
  const [isExpanded, setIsExpanded] = useState(true);

  const fieldPath = `${basePath}[${index}]`;
  const currentType = watch(`${fieldPath}.type`);
  const currentName = watch(`${fieldPath}.name`);
  const children = watch(`${fieldPath}.children`) || [];

  const {
    fields: childFields,
    append: appendChild,
    remove: removeChild,
  } = useFieldArray({
    name: `${fieldPath}.children`,
  });

  const addChildField = () => {
    appendChild({
      id: `field_${Date.now()}_${Math.random()}`,
      name: "",
      type: "string",
      value: "",
      children: [],
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "string":
        return "bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 dark:from-blue-950 dark:to-cyan-950 dark:border-blue-700 shadow-blue-100 dark:shadow-blue-900/20";
      case "number":
        return "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 dark:from-green-950 dark:to-emerald-950 dark:border-green-700 shadow-green-100 dark:shadow-green-900/20";
      case "nested":
        return "bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 dark:from-purple-950 dark:to-pink-950 dark:border-purple-700 shadow-purple-100 dark:shadow-purple-900/20";
      default:
        return "bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200 dark:from-gray-950 dark:to-slate-950 dark:border-gray-700";
    }
  };

  const getTypeBadge = (type: string) => {
    const baseClasses = "font-semibold text-xs px-3 py-1 rounded-full border-2";
    switch (type) {
      case "string":
        return (
          <Badge
            className={`${baseClasses} bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-blue-300 shadow-lg`}>
            <Type className="w-3 h-3 mr-1" />
            String
          </Badge>
        );
      case "number":
        return (
          <Badge
            className={`${baseClasses} bg-gradient-to-r from-green-500 to-emerald-500 text-white border-green-300 shadow-lg`}>
            <Hash className="w-3 h-3 mr-1" />
            Number
          </Badge>
        );
      case "nested":
        return (
          <Badge
            className={`${baseClasses} bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-300 shadow-lg`}>
            <ChevronRight className="w-3 h-3 mr-1" />
            Nested Object
          </Badge>
        );
      default:
        return (
          <Badge
            className={`${baseClasses} bg-gray-500 text-white border-gray-300`}>
            {type}
          </Badge>
        );
    }
  };

  return (
    <Card
      className={`${getTypeColor(
        currentType
      )} transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-2 shadow-lg`}>
      <CardContent className="p-5">
        <div className="space-y-3">
          {/* Field Header */}
          <div className="flex items-start gap-3">
            <div className="flex-1 space-y-3">
              {/* Name and Type Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="flex items-center gap-1 text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                    <Key className="w-3 h-3" />
                    Key
                  </label>
                  <Input
                    {...register(`${fieldPath}.name`)}
                    placeholder="Enter key name"
                    className="text-sm font-medium border-2 focus:ring-2 focus:ring-offset-1 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1 text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                    <Type className="w-3 h-3" />
                    Datatype
                  </label>
                  <Select
                    value={currentType}
                    onValueChange={(value) => {
                      setValue(`${fieldPath}.type`, value);
                      if (value !== "nested") {
                        setValue(`${fieldPath}.children`, []);
                      }
                      // Reset value when type changes
                      setValue(
                        `${fieldPath}.value`,
                        value === "number" ? 0 : ""
                      );
                    }}>
                    <SelectTrigger className="text-sm font-medium border-2 focus:ring-2 focus:ring-offset-1 transition-all duration-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="string">String</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="nested">Nested Object</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Value Row - Only show for string and number types */}
              {currentType !== "nested" && (
                <div>
                  <label className="flex items-center gap-1 text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                    <Hash className="w-3 h-3" />
                    Value
                  </label>
                  <Input
                    {...register(`${fieldPath}.value`)}
                    type={currentType === "number" ? "number" : "text"}
                    placeholder={
                      currentType === "number"
                        ? "Enter number"
                        : "Enter text value"
                    }
                    className="text-sm font-medium border-2 focus:ring-2 focus:ring-offset-1 transition-all duration-200"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center gap-1 pt-6">
              {currentType === "nested" && children.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1 h-8 w-8">
                  {isExpanded ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </Button>
              )}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onRemove}
                className="p-1 h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 border-red-200 hover:border-red-300">
                <Trash2 size={16} />
              </Button>
            </div>
          </div>

          {/* Type Badge */}
          <div className="flex items-center justify-between">
            {getTypeBadge(currentType)}

            {currentType === "nested" && (
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={addChildField}
                className="text-xs gap-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg">
                <Plus size={12} />
                Add Field
              </Button>
            )}
          </div>

          {/* Nested Fields */}
          {currentType === "nested" && isExpanded && childFields.length > 0 && (
            <div className="ml-4 pl-4 border-l-4 border-dashed border-purple-400 dark:border-purple-500 space-y-3 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/50 dark:to-pink-950/50 rounded-r-lg py-2">
              {childFields.map((childField, childIndex) => (
                <FieldItem
                  key={childField.id}
                  field={childField as SchemaField}
                  index={childIndex}
                  onRemove={() => removeChild(childIndex)}
                  basePath={`${fieldPath}.children`}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
