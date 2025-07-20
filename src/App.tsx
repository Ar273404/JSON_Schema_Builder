import { useState } from "react";
import { SchemaBuilder } from "./components/SchemaBuilder";
import { JsonPreview } from "./components/JsonPreview";
import { SavedObjects } from "./components/SavedObjects";
import { generateJsonSchema } from "./utils/schemaGenerator";
import { SchemaField, SavedObject } from "./types/schema";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./components/common/Tabs";

function App() {
  const [schemaFields, setSchemaFields] = useState<SchemaField[]>([]);
  const [savedObjects, setSavedObjects] = useState<SavedObject[]>([]);

  const jsonObject = generateJsonSchema(schemaFields);

  const handleSubmitObject = (
    objectName: string,
    schema: Record<string, any>
  ) => {
    const newObject: SavedObject = {
      id: `obj_${Date.now()}_${Math.random()}`,
      name: objectName,
      data: schema,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setSavedObjects((prev) => [newObject, ...prev]);
    setSchemaFields([]); // Reset the form
  };

  const handleResetForm = () => {
    setSchemaFields([]);
  };

  const handleUpdateObject = (
    id: string,
    newName: string,
    newData: Record<string, any>
  ) => {
    setSavedObjects((prev) =>
      prev.map((obj) =>
        obj.id === id
          ? { ...obj, name: newName, data: newData, updatedAt: new Date() }
          : obj
      )
    );
  };

  const handleDeleteObject = (id: string) => {
    setSavedObjects((prev) => prev.filter((obj) => obj.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900 dark:via-purple-900 dark:to-gray-900">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            JSON Schema Builder
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-xl font-medium">
            Create beautiful JSON schemas with Key, Datatype, and Value fields
            in real-time
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-10rem)]">
          {/* Schema Builder */}
          <div className="order-2 lg:order-1 lg:col-span-1">
            <SchemaBuilder
              onSchemaChange={setSchemaFields}
              currentSchema={jsonObject}
              onSubmit={handleSubmitObject}
              onReset={handleResetForm}
            />
          </div>

          {/* Right Panel with Tabs */}
          <div className="order-1 lg:order-2 lg:col-span-2">
            <Tabs defaultValue="preview" className="h-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger
                  value="preview"
                  className="flex items-center gap-2">
                  <span>JSON Preview</span>
                </TabsTrigger>
                <TabsTrigger value="saved" className="flex items-center gap-2">
                  <span>Saved Objects ({savedObjects.length})</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="preview" className="h-[calc(100%-4rem)]">
                <JsonPreview schema={jsonObject} />
              </TabsContent>

              <TabsContent value="saved" className="h-[calc(100%-4rem)]">
                <SavedObjects
                  savedObjects={savedObjects}
                  onUpdate={handleUpdateObject}
                  onDelete={handleDeleteObject}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
