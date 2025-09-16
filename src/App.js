import React, { useState } from 'react';
import { Copy, Download, RefreshCw, Lightbulb, AlertCircle } from 'lucide-react';

function App() {
  const [formData, setFormData] = useState({
    input_text: '',
    tone: 'Professional',
    antal_varianter: 5
  });

  const [generatedAds, setGeneratedAds] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [qualityScores, setQualityScores] = useState([]);

  const tones = [
    { value: 'Professional', label: '💼 Professionel', desc: 'Formel og tillidsfuld' },
    { value: 'Friendly', label: '😊 Venlig', desc: 'Varm og tilgængelig' },
    { value: 'Confident', label: '💪 Selvsikker', desc: 'Stærk og overbevisende' },
    { value: 'Educational', label: '🎓 Pædagogisk', desc: 'Informativ og vejledende' }
  ];

  // Kvalitetskontrol system
  const bannedWords = new Set([
    'revolutionerende', 'banebrydende', 'markedsledende', 'bedst i klassen', 
    'cutting-edge', 'state-of-the-art', 'unik', 'enestående', 'fantastisk',
    'utrolig', 'ekstraordinær', 'verdensklasse', 'premium', 'luksuriøs'
  ]);

  const benefitVerbs = [
    'spar', 'reducer', 'øg', 'sikr', 'lever', 'forbedr', 'optimer',
    'automatiser', 'strømlin', 'accelerer', 'boost', 'skaler'
  ];

  const hounisenRequired = ['dansk', 'siden 1973', 'certificeret', 'support', 'kvalitet'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Sproglig kvalitetskontrol
  const calculateQualityScore = (text) => {
    // Specificitets-scoring
    const hasNumber = /\b\d+(\.\d+)?%?\b/.test(text);
    const hasBenefitVerb = benefitVerbs.some(v => 
      new RegExp(`\\b${v}[a-zA-ZæøåÆØÅ]*\\b`, "i").test(text)
    );
    const specificity = (hasNumber ? 0.6 : 0) + (hasBenefitVerb ? 0.4 : 0);

    // Sætningslængde (dansk optimeret)
    const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean);
    const words = text.trim().split(/\s+/).length;
    const avgSentenceLength = words / Math.max(1, sentences.length);
    const brevity = avgSentenceLength <= 15 ? 1 : Math.max(0, 1 - (avgSentenceLength - 15) / 10);

    // Bannede ord check
    const lowerText = text.toLowerCase();
    const hasBannedWords = Array.from(bannedWords).some(word => lowerText.includes(word));
    const bannedPenalty = hasBannedWords ? 0.3 : 1.0;

    // Aktiv vs passiv stemme (dansk heuristik)
    const passiveMarkers = ['bliver', 'er blevet', 'blev', 'var', 'blev leveret af'];
    const hasPassive = passiveMarkers.some(marker => lowerText.includes(marker));
    const activeBonus = hasPassive ? 0.7 : 1.0;

    const totalScore = (specificity * 0.3 + brevity * 0.3 + bannedPenalty * 0.2 + activeBonus * 0.2);
    
    return {
      total: Math.min(1, totalScore),
      specificity,
      brevity,
      bannedWords: hasBannedWords,
      activeVoice: !hasPassive,
      avgSentenceLength
    };
  };

  // Verbedret tekstprocessering med vinkler
  const parseAndOptimizeWithAngles = (input, tone, angle) => {
    // Rens input
    let cleanedInput = input
      .replace(/\([^)]*\)/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const stopWords = ['honorar', 'skal ikke indgå', 'mulige budskaber'];
    stopWords.forEach(stopWord => {
      cleanedInput = cleanedInput.replace(new RegExp(stopWord, 'gi'), '');
    });

    // Intelligent emneekstraktion
    let coreSubject = 'laboratorieudstyr';
    let subjectVariations = {
      singular: 'laboratorieudstyr',
      definite: 'det rigtige udstyr',
      context: 'laboratorieområdet',
      benefit: 'pålidelige analyser'
    };

    if (cleanedInput.toLowerCase().includes('ekg')) {
      coreSubject = 'EKG-udstyr';
      subjectVariations = {
        singular: 'EKG-udstyr',
        definite: 'præcist EKG-udstyr',
        context: 'EKG-diagnostik',
        benefit: 'sikre diagnoser'
      };
    } else if (cleanedInput.toLowerCase().includes('mikroskop')) {
      coreSubject = 'mikroskoper';
      subjectVariations = {
        singular: 'mikroskoper',
        definite: 'kvalitetsmikroskoper',
        context: 'mikroskopi',
        benefit: 'skarpe billeder'
      };
    }

    // Vinkel-baserede startere
    const angleTemplates = {
      'Pain': {
        starters: [
          `Træt af forsinkede leverancer af ${subjectVariations.singular}?`,
          `Stop med at bekymre dig om ${subjectVariations.context}.`,
          `Frustreret over manglende support til ${subjectVariations.singular}?`
        ],
        benefits: [
          `Vi løser dine udfordringer med ${subjectVariations.benefit}.`,
          `Dansk support sikrer hurtig hjælp når du har brug for det.`,
          `50+ års erfaring garanterer pålidelige løsninger.`
        ]
      },
      'Outcome': {
        starters: [
          `Få ${subjectVariations.benefit} med certificeret ${subjectVariations.singular}.`,
          `Øg din præcision med dansk ${subjectVariations.singular}.`,
          `Sikr optimal ${subjectVariations.context} med proven kvalitet.`
        ],
        benefits: [
          `Resultater du kan stole på siden 1973.`,
          `Dag-til-dag levering når du har brug for det.`,
          `Hounisen garanterer din succes.`
        ]
      },
      'Proof': {
        starters: [
          `50+ års tillid fra danske ${subjectVariations.context} professionelle.`,
          `Over 1000 kunder vælger Hounisens ${subjectVariations.singular}.`,
          `Siden 1973 har vi leveret ${subjectVariations.benefit} til erhvervet.`
        ],
        benefits: [
          `Certificerede produkter du kan stole på.`,
          `Danmarks største varelager sikrer tilgængelighed.`,
          `Dokumenteret kvalitet gennem fem årtier.`
        ]
      },
      'Objection': {
        starters: [
          `"For dyrt" er ikke længere et problem med vores ${subjectVariations.singular}.`,
          `"Svært at bestille" hører fortiden til med Hounisen.`,
          `"Langsom levering" er ikke et issue med dag-til-dag service.`
        ],
        benefits: [
          `Konkurrencedygtige priser på certificeret kvalitet.`,
          `Nem bestilling og personlig rådgivning.`,
          `Hurtig levering og dansk support inkluderet.`
        ]
      },
      'Urgency': {
        starters: [
          `Kun 15 konsultationer tilbage i september.`,
          `Sidste chance for 2024 leveringsaftaler.`,
          `Begrænsede lagre på populære ${subjectVariations.singular}.`
        ],
        benefits: [
          `Sikr din plads til personlig rådgivning.`,
          `Book din leveringsaftale før årets udgang.`,
          `Reservér dit ${subjectVariations.singular} i dag.`
        ]
      }
    };

    const template = angleTemplates[angle] || angleTemplates['Outcome'];
    
    return {
      cleanedInput,
      coreSubject,
      subjectVariations,
      starter: template.starters[Math.floor(Math.random() * template.starters.length)],
      benefit: template.benefits[Math.floor(Math.random() * template.benefits.length)],
      angle
    };
  };

  const generateAdTexts = async () => {
    setIsGenerating(true);
    
    await new Promise(resolve => setTimeout(resolve, 2500));

    if (!formData.input_text.trim()) {
      setGeneratedAds([]);
      setIsGenerating(false);
      return;
    }

    const brandContext = {
      company: 'Hounisen',
      heritage: '50+ års erfaring siden 1973',
      values: 'Service, kvalitet og enkelhed',
      benefits: 'dag-til-dag levering, dansk support, certificerede produkter',
      location: 'dansk virksomhed i Skanderborg'
    };

    // Definerede vinkler for variation
    const angles = ['Pain', 'Outcome', 'Proof', 'Objection', 'Urgency'];
    const ads = [];
    const scores = [];

    for (let i = 0; i < formData.antal_varianter; i++) {
      const angle = angles[i] || angles[i % angles.length];
      const parsed = parseAndOptimizeWithAngles(formData.input_text, formData.tone, angle);

      // Skab naturlige templates baseret på vinkel
      let introduktion = `${parsed.starter} ${parsed.benefit}`;
      
      const overskrift = [
        `${parsed.subjectVariations.singular} - Dansk kvalitet`,
        `Pålidelig ${parsed.subjectVariations.context} siden 1973`,
        `${brandContext.company}: ${parsed.subjectVariations.singular}`,
        `Certificeret ${parsed.subjectVariations.singular}`,
        `Eksperter i ${parsed.subjectVariations.context}`
      ][i] || `${parsed.subjectVariations.singular} - Dansk kvalitet`;

      const beskrivelse = [
        `${brandContext.values} inden for ${parsed.subjectVariations.context}.`,
        `Gratis rådgivning og ${brandContext.benefits}.`,
        `Kontakt os for professionel vejledning.`,
        `Skræddersyede løsninger til dine behov.`,
        `${brandContext.company} - din danske partner.`
      ][i] || `${brandContext.values} inden for ${parsed.subjectVariations.context}.`;

      const alt_text = `${brandContext.company} ${parsed.subjectVariations.singular} til professionelt brug`;

      // Optimér længder
      if (introduktion.length > 150) {
        const lastSpace = introduktion.lastIndexOf(' ', 147);
        introduktion = introduktion.substring(0, lastSpace) + '...';
      }

      // Beregn kvalitetsscore
      const fullText = `${introduktion} ${overskrift} ${beskrivelse}`;
      const qualityScore = calculateQualityScore(fullText);

      ads.push({
        id: i + 1,
        introduktion,
        overskrift: overskrift.length > 70 ? overskrift.substring(0, 67) + '...' : overskrift,
        beskrivelse: beskrivelse.length > 200 ? beskrivelse.substring(0, 197) + '...' : beskrivelse,
        alt_text: alt_text.length > 125 ? alt_text.substring(0, 122) + '...' : alt_text,
        angle: angle,
        introduktionLength: introduktion.length,
        overskriftLength: overskrift.length > 70 ? 70 : overskrift.length,
        beskrivelseLength: beskrivelse.length > 200 ? 200 : beskrivelse.length,
        altTextLength: alt_text.length > 125 ? 125 : alt_text.length
      });

      scores.push(qualityScore);
    }

    // Sortér efter kvalitet
    const sortedIndices = scores
      .map((score, index) => ({ score: score.total, index }))
      .sort((a, b) => b.score - a.score)
      .map(item => item.index);

    const sortedAds = sortedIndices.map(i => ads[i]);
    const sortedScores = sortedIndices.map(i => scores[i]);

    setGeneratedAds(sortedAds);
    setQualityScores(sortedScores);
    setIsGenerating(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const exportToCSV = () => {
    const headers = ['Variant', 'Vinkel', 'Introduktion', 'Overskrift', 'Beskrivelse', 'Alt-tekst', 'Kvalitetsscore'];
    const csvContent = [
      headers.join(','),
      ...generatedAds.map((ad, idx) => [
        `Variant ${ad.id}`,
        ad.angle,
        `"${ad.introduktion}"`,
        `"${ad.overskrift}"`,
        `"${ad.beskrivelse}"`,
        `"${ad.alt_text}"`,
        qualityScores[idx] ? qualityScores[idx].total.toFixed(2) : ''
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

  const getQualityColor = (score) => {
    if (score >= 0.8) return 'text-green-600 bg-green-50';
    if (score >= 0.6) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const selectedTone = tones.find(t => t.value === formData.tone);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">Hounisen</h1>
          <p className="text-blue-100">Intelligent LinkedIn Annonce Generator med Kvalitetskontrol</p>
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
                  placeholder="f.eks. Vigtigheden af præcist EKG-udstyr i psykiatrisk praksis"
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
                </select>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Automatiske Vinkler:</p>
                    <ul className="text-xs space-y-1">
                      <li>• Problem-fokuseret (Pain)</li>
                      <li>• Resultat-fokuseret (Outcome)</li>
                      <li>• Dokumentation (Proof)</li>
                      <li>• Indvending-afkræfter (Objection)</li>
                      <li>• Tidsbegrænset (Urgency)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 p-3 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-amber-800">
                    <p className="font-medium mb-1">Bannede Ord:</p>
                    <p>revolutionerende, banebrydende, markedsledende, unik, fantastisk</p>
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
                {isGenerating ? 'Genererer Skarpe LinkedIn Annoncer...' : 'Generer Skarpe LinkedIn Annoncer'}
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:w-2/3 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Kvalitetskontrollerede Annoncer</h2>
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
                <p>Skriv dit annonce-indhold ovenfor og få kvalitetskontrollerede LinkedIn annoncer</p>
                <p className="text-sm mt-2">Alle annoncer bliver automatisk scoret på sprog, specificitet og klarhed</p>
              </div>
            ) : (
              <div className="space-y-6">
                {generatedAds.map((ad, idx) => (
                  <div key={ad.id} className="bg-white border rounded-xl p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-blue-600">
                        Variant {ad.id} - {ad.angle}
                      </h3>
                      {qualityScores[idx] && (
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getQualityColor(qualityScores[idx].total)}`}>
                          Kvalitet: {(qualityScores[idx].total * 100).toFixed(0)}%
                        </div>
                      )}
                    </div>
                    
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

                      {/* Kvalitets-detaljer */}
                      {qualityScores[idx] && (
                        <div className="bg-gray-50 p-3 rounded-lg mt-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Kvalitetsanalyse:</h4>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>Specificitet: {(qualityScores[idx].specificity * 100).toFixed(0)}%</div>
                            <div>Klarhed: {(qualityScores[idx].brevity * 100).toFixed(0)}%</div>
                            <div>Aktiv stemme: {qualityScores[idx].activeVoice ? 'Ja' : 'Nej'}</div>
                            <div>Bannede ord: {qualityScores[idx].bannedWords ? 'Fundet' : 'Ingen'}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Guidelines Footer */}
        <div className="bg-gray-50 p-6 border-t">
          <h3 className="font-semibold mb-3">Automatisk Kvalitetskontrol og Hounisen Brand Integration</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-700">
            <div>
              <strong>Sprogkvalitet:</strong> Korte sætninger, aktiv stemme, konkrete fordele, ingen corporate speak
            </div>
            <div>
              <strong>Variation:</strong> 5 forskellige vinkler - Pain, Outcome, Proof, Objection, Urgency
            </div>
            <div>
              <strong>Brand:</strong> Automatisk integration af 50+ års erfaring, dansk kvalitet, certificering
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
