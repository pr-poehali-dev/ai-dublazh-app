import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';

export default function Index() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sourceLanguage] = useState('ru');
  const [targetLanguage] = useState('en');
  const [voiceSimilarity, setVoiceSimilarity] = useState([85]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('video/')) {
      setFile(droppedFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleProcess = () => {
    setIsProcessing(true);
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      setProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsProcessing(false);
          setProgress(0);
        }, 500);
      }
    }, 200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-500 mb-6 shadow-lg">
            <Icon name="Languages" size={40} className="text-white" />
          </div>
          <h1 className="text-5xl font-semibold text-gray-900 mb-3 tracking-tight">
            Dub video
          </h1>
          <p className="text-xl text-gray-500 font-light">
            Dub voiceover into a new language
          </p>
        </div>

        <div className="animate-scale-in">
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-xl">
            <div className="p-8">
              <Tabs defaultValue="upload" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8 bg-gray-100 p-1 rounded-xl">
                  <TabsTrigger value="upload" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    Upload
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm" disabled={!file}>
                    Settings
                  </TabsTrigger>
                  <TabsTrigger value="process" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm" disabled={!file}>
                    Process
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="mt-0">
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-2xl p-16 transition-all duration-300 ${
                      isDragging
                        ? 'border-blue-500 bg-blue-50/50 scale-[1.02]'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                    }`}
                  >
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileSelect}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      id="file-upload"
                    />
                    <div className="text-center">
                      {file ? (
                        <div className="animate-scale-in">
                          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-100 mb-4">
                            <Icon name="CheckCircle2" size={32} className="text-green-600" />
                          </div>
                          <p className="text-lg font-medium text-gray-900 mb-1">{file.name}</p>
                          <p className="text-sm text-gray-500">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFile(null);
                            }}
                            className="mt-4 text-gray-600 hover:text-gray-900"
                          >
                            Remove file
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 mb-4">
                            <Icon name="Upload" size={32} className="text-gray-400" />
                          </div>
                          <p className="text-lg font-medium text-gray-900 mb-1">
                            Drop your video here
                          </p>
                          <p className="text-sm text-gray-500 mb-6">or click to browse</p>
                          <div className="inline-flex items-center gap-2 text-xs text-gray-400">
                            <Icon name="Info" size={14} />
                            <span>Supports MP4, MOV, AVI up to 500MB</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="mt-0 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Source Language
                      </label>
                      <Select defaultValue={sourceLanguage}>
                        <SelectTrigger className="h-12 rounded-xl border-gray-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ru">🇷🇺 Russian</SelectItem>
                          <SelectItem value="en">🇬🇧 English</SelectItem>
                          <SelectItem value="es">🇪🇸 Spanish</SelectItem>
                          <SelectItem value="fr">🇫🇷 French</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Target Language
                      </label>
                      <Select defaultValue={targetLanguage}>
                        <SelectTrigger className="h-12 rounded-xl border-gray-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">🇬🇧 English</SelectItem>
                          <SelectItem value="ru">🇷🇺 Russian</SelectItem>
                          <SelectItem value="es">🇪🇸 Spanish</SelectItem>
                          <SelectItem value="fr">🇫🇷 French</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4 p-6 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">
                          Voice Similarity
                        </label>
                        <p className="text-xs text-gray-500">
                          How close the AI voice should match yours
                        </p>
                      </div>
                      <span className="text-2xl font-semibold text-blue-600">
                        {voiceSimilarity[0]}%
                      </span>
                    </div>
                    <Slider
                      value={voiceSimilarity}
                      onValueChange={setVoiceSimilarity}
                      min={0}
                      max={100}
                      step={5}
                      className="py-4"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Natural</span>
                      <span>Exact Clone</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Icon name="Mic" size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Voice Clone</p>
                        <p className="text-sm font-medium text-gray-900">Enabled</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                        <Icon name="Wand2" size={20} className="text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Lip Sync</p>
                        <p className="text-sm font-medium text-gray-900">Auto</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="process" className="mt-0">
                  {!isProcessing && progress === 0 ? (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-500 mb-6">
                        <Icon name="Play" size={36} className="text-white ml-1" />
                      </div>
                      <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                        Ready to Process
                      </h3>
                      <p className="text-gray-500 mb-8">
                        Click the button below to start dubbing your video
                      </p>
                      <Button
                        onClick={handleProcess}
                        size="lg"
                        className="h-14 px-8 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium shadow-lg hover:shadow-xl transition-all"
                      >
                        <Icon name="Sparkles" size={20} className="mr-2" />
                        Start Dubbing
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6 py-8">
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100 mb-4 animate-pulse-soft">
                          <Icon name="Loader2" size={32} className="text-blue-600 animate-spin" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                          Processing Your Video
                        </h3>
                        <p className="text-sm text-gray-500">
                          This may take a few minutes...
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Progress value={progress} className="h-2" />
                        <p className="text-center text-sm font-medium text-gray-600">
                          {progress}%
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mt-8">
                        <div className="text-center p-4 bg-gray-50 rounded-xl">
                          <Icon name="FileAudio" size={24} className="mx-auto mb-2 text-gray-400" />
                          <p className="text-xs text-gray-600">Extracting Audio</p>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-xl">
                          <Icon name="Languages" size={24} className="mx-auto mb-2 text-gray-400" />
                          <p className="text-xs text-gray-600">Translating</p>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-xl">
                          <Icon name="Mic2" size={24} className="mx-auto mb-2 text-gray-400" />
                          <p className="text-xs text-gray-600">Cloning Voice</p>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </Card>
        </div>

        <div className="mt-8 text-center text-sm text-gray-400">
          <p>Powered by AI • Secure & Private</p>
        </div>
      </div>
    </div>
  );
}
