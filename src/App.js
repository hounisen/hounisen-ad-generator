import React, { useState } from 'react';
import { Copy, Download, RefreshCw, Lightbulb } from 'lucide-react';

function App() {
  const [formData, setFormData] = useState({
    input_text: '',
    tone: 'Professional',
    antal_varianter: 5
  });

  const [generatedAds, setGeneratedAds] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const tones = [
    { value: 'Professional', label: '💼 Professional', desc: 'Formel og tillidsfuld' },
    { value: 'Friendly', label: '😊 Friendly', desc: 'Varm og tilgængelig' },
    { value: 'Confident', label: '💪 Confident', desc: 'Stærk og overbevisende' },
    { value: 'Educational', label: '🎓 Educational', desc: 'Pædagogisk og informativ' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // LinkedIn best practice analyzer og optimizer
  const optimizeForLinkedIn = (input, tone) => {
    const baseTemplates = {
      hooks: [
        'Vidste du at',
        'Forestil dig hvis',
        'Hvad nu hvis',
        'Det her ændrede alt:',
        'Stop med at gøre dette:'
      ],
      questions: [
        'Kender du følelsen af',
        'Har du nogensinde spekuleret over',
        'Hvad er det første du tænker på når',
        'Hvor mange gange har du oplevet',
        'Hvad hvis jeg fortalte dig at'
      ],
      ctas: [
        'Kontakt os for at lære mere',
        'Se hvordan vi kan hjælpe dig',
        'Book en gratis konsultation',
        'Få din gratis guide',
        'Læs mere på vores hjemmeside'
      ]
    };

    return {
      hook: baseTemplates.hooks[Math.floor(Math.random() * baseTemplates.hooks.length)],
      question: baseTemplates.questions[Math.floor(Math.random() * baseTemplates.questions.length)],
      cta: baseTemplates.ctas[Math.floor(Math.random() * baseTemplates.ctas.length)]
    };
  };

  const generateAdTexts = async () => {
    setIsGenerating(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (!formData.input_text.trim()) {
      setGeneratedAds([]);
      setIsGenerating(false);
      return;
    }

    const content = formData.input_text.trim();
    const elements = optimizeForLinkedIn(content, formData.tone);

    // Hounisen brand context
    const brandContext = {
      company: 'Hounisen',
      heritage: 'Over 50 års erfaring siden 1973',
      values: 'Service, kvalitet og enkelhed',
      benefits: 'Dag-til-dag levering, dansk support, certificerede produkter',
      location: 'Dansk virksomhed i Skanderborg'
    };

    // Intelligente templates baseret på input
    const templates = {
      introduktion: [
        `${elements.question} ${content}? ${brandContext.heritage} har lært os ${brandContext.values}.`,
        `${elements.hook} ${content}. Hos ${brandContext.company} sikrer vi at du får de rigtige løsninger.`,
        `${content} - det ved vi alt om. Som ${brandContext.location} leverer vi ${brandContext.benefits}.`,
        `Stop med at bekymre dig om ${content}. Vi har ${brandContext.heritage} og kan hjælpe dig.`,
        `${content}? Vi forstår udfordringen. ${brandContext.company} tilbyder pålidelige løsninger siden 1973.`
      ],
      overskrift: [
        `${content} - Vi har løsningen`,
        `Ekspert i ${content} siden 1973`,
        `${content}: Service & Kvalitet`,
        `Pålidelige løsninger til ${content}`,
        `${brandContext.company} - Din partner til ${content}`
      ],
      beskrivelse: [
        `${brandContext.values} til alle dine behov inden for ${content}.`,
        `Professionel rådgivning og ${brandContext.benefits}.`,
        `${brandContext.company} - din danske samarbejdspartner.`,
        `Gratis konsultation og skræddersyede løsninger.`,
        `${elements.cta} - vi sidder klar til at hjælpe.`
      ],
      alt_text: [
        `Professionelt udstyr fra ${brandContext.company} til ${content}`,
        `Kvalitetsprodukter og service siden 1973`,
        `${brandContext.location} - specialiseret i ${content}`,
        `Dansk support og hurtig levering af udstyr`,
        `${brandContext.company} produkter til professionelt brug`
      ]
    };

    const ads = [];
    for (let i = 0; i < formData.antal_varianter; i++) {
      let introduktion = templates.introduktion[i] || templates.introduktion[i % templates.introduktion.length];
      let overskrift = templates.overskrift[i] || templates.overskrift[i % templates.overskrift.length];
      let beskrivelse = templates.beskrivelse[i] || templates.beskrivelse[i % templates.beskrivelse.length];
      let alt_text = templates.alt_text[i] || templates.alt_text[i % templates.alt_text.length];
      
      // Apply tone adjustments
      if (formData.tone === 'Friendly') {
        introduktion = introduktion.replace(/Vi har|vi sikrer|Vi forstår/, match => 
          match === 'Vi har' ? 'Vi har' : 
          match === 'vi sikrer' ? 'vi sørger for' : 'Vi kender'
        );
      } else if (formData.tone === 'Confident') {
        introduktion = introduktion.replace(/kan hjælpe|tilbyder/, match =>
          match === 'kan hjælpe' ? 'løser' : 'leverer'
        );
      }
      
      // Optimize for LinkedIn character limits
      if (introduktion.length > 150) {
        const lastSpace = introduktion.lastIndexOf(' ', 147);
        introduktion = introduktion.substring(0, lastSpace) + '...';
      }
      if (overskrift.length > 70) {
        const lastSpace = overskrift.lastIndexOf(' ', 67);
        overskrift = overskrift.substring(0, lastSpace) + '...';
      }
      if (beskrivelse.length > 200) {
        const lastSpace = beskrivelse.lastIndexOf(' ', 197);
        beskrivelse = beskrivelse.substring(0, lastSpace) + '...';
      }
      if (alt_text.length > 125) {
        const lastSpace = alt_text.lastIndexOf(' ', 122);
        alt_text = alt_text.substring(0, lastSpace) + '...';
      }
      
      ads.push({
        id: i + 1,
        introduktion,
        overskrift,
        beskrivelse,
        alt_text,
        introduktionLength: introduktion.length,
        overskriftLength: overskrift.length,
        beskrivelseLength: beskrivelse.length,
        altTextLength: alt_text.length
      });
    }

    setGeneratedAds(ads);
    setIsGenerating(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const exportToCSV = () => {
    const headers = ['Variant', 'Introduktion', 'Overskrift', 'Beskrivelse', 'Alt-tekst'];
    const csvContent = [
      headers.join(','),
      ...generatedAds.map(ad => [
        `Variant ${ad.id}`,
        `"${ad.introduktion}"`,
        `"${ad.overskrift}"`,
        `"${ad.beskrivelse}"`,
        `"${ad.alt_text}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hounisen-linkedin-ads-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const selectedTone = tones.find(t => t.value === formData.tone);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">Hounisen</h1>
          <p className="text-blue-100">Intelligent LinkedIn Annonce Generator</p>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Input Panel */}
          <div className="lg:w-1/3 p-6 bg-gray-50 border-r">
            <h2 className="text-xl font-semibold mb-4">Hvad handler din annonce om?</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Beskriv dit indhold, produkt eller budskab</label>
                <textarea
                  name="input_text"
                  value={formData.input_text}
                  onChange={handleInputChange}
                  placeholder="f.eks. Hvorfor det er vigtigt at vælge det rigtige laboratorieudstyr til præcise analyser"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none h-32"
                  rows={6}
                />
                <div className="text-right text-xs text-gray-500 mt-1">
                  {formData.input_text.length} / 500 tegn
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tone of Voice</label>
                <div className="relative">
                  <select
                    name="tone"
                    value={formData.tone}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  >
                    {tones.map(tone => (
                      <option key={tone.value} value={tone.value}>
                        {tone.label}
                      </option>
                    ))}
                  </select>
                </div>
                {selectedTone && (
                  <p className="text-xs text-gray-600 mt-1">{selectedTone.desc}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Antal Varianter</label>
                <select
                  name="antal_varianter"
                  value={formData.antal_varianter}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={3}>3 varianter</option>
                  <option value={5}>5 varianter</option>
                  <option value={10}>10 varianter</option>
                </select>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Tips til bedre annoncer:</p>
                    <ul className="text-xs space-y-1">
                      <li>• Stil spørgsmål der engagerer</li>
                      <li>• Fokuser på kundens udfordring</li>
                      <li>• Inkluder konkrete fordele</li>
                      <li>• Brug handlingsopfordringer</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                onClick={generateAdTexts}
                disabled={isGenerating || !formData.input_text.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 flex items-center justify-center"
              >
                {isGenerating ? (
                  <RefreshCw className="animate-spin mr-2 w-5 h-5" />
                ) : null}
                {isGenerating ? 'Genererer LinkedIn Annoncer...' : 'Generer LinkedIn Annoncer'}
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:w-2/3 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Optimerede LinkedIn Annoncer</h2>
              {generatedAds.length > 0 && (
                <button
                  onClick={exportToCSV}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
                >
                  <Download className="mr-2 w-4 h-4" />
                  Eksporter CSV
                </button>
              )}
            </div>

            {generatedAds.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>Skriv dit annonce-indhold ovenfor og klik "Generer" for at få optimerede LinkedIn annoncer</p>
                <p className="text-sm mt-2">Alle annoncer følger automatisk Hounisen's tone of voice og LinkedIn best practices</p>
              </div>
            ) : (
              <div className="space-y-6">
                {generatedAds.map((ad) => (
                  <div key={ad.id} className="bg-white border rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold mb-4 text-blue-600">Variant {ad.id}</h3>
                    
                    <div className="space-y-4">
                      {/* Introduktionstekst */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-sm font-medium text-gray-700">Introduktionstekst</label>
                          <span className={`text-xs px-2 py-1 rounded ${ad.introduktionLength <= 150 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {ad.introduktionLength}/150 tegn
                          </span>
                        </div>
                        <div className="relative">
                          <textarea
                            value={ad.introduktion}
                            readOnly
                            className="w-full p-3 border rounded-lg bg-gray-50 resize-none"
                            rows={3}
                          />
                          <button
                            onClick={() => copyToClipboard(ad.introduktion)}
                            className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Headline */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-sm font-medium text-gray-700">Headline (Overskrift)</label>
                          <span className={`text-xs px-2 py-1 rounded ${ad.overskriftLength <= 70 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {ad.overskriftLength}/70 tegn
                          </span>
                        </div>
                        <div className="relative">
                          <input
                            value={ad.overskrift}
                            readOnly
                            className="w-full p-3 border rounded-lg bg-gray-50"
                          />
                          <button
                            onClick={() => copyToClipboard(ad.overskrift)}
                            className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-sm font-medium text-gray-700">Description (Beskrivelse)</label>
                          <span className={`text-xs px-2 py-1 rounded ${ad.beskrivelseLength <= 200 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {ad.beskrivelseLength}/200 tegn
                          </span>
                        </div>
                        <div className="relative">
                          <textarea
                            value={ad.beskrivelse}
                            readOnly
                            className="w-full p-3 border rounded-lg bg-gray-50 resize-none"
                            rows={2}
                          />
                          <button
                            onClick={() => copyToClipboard(ad.beskrivelse)}
                            className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Alt-tekst */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-sm font-medium text-gray-700">Alt-tekst (Tilgængelighed)</label>
                          <span className={`text-xs px-2 py-1 rounded ${ad.altTextLength <= 125 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {ad.altTextLength}/125 tegn
                          </span>
                        </div>
                        <div className="relative">
                          <input
                            value={ad.alt_text}
                            readOnly
                            className="w-full p-3 border rounded-lg bg-gray-50"
                          />
                          <button
                            onClick={() => copyToClipboard(ad.alt_text)}
                            className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Guidelines Footer */}
        <div className="bg-gray-50 p-6 border-t">
          <h3 className="font-semibold mb-3">Automatisk Integration af Hounisen Brand & LinkedIn Best Practices</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-700">
            <div>
              <strong>Brand Integration:</strong> Over 50 års erfaring, dansk support, service & kvalitet
            </div>
            <div>
              <strong>LinkedIn Optimering:</strong> Korrekte tegngrænser, hooks, spørgsmål, CTA's
            </div>
            <div>
              <strong>Tone of Voice:</strong> Professionel, serviceorienteret, troværdig og pædagogisk
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
