import React, { useState } from 'react';
import { Copy, Download, RefreshCw, Settings } from 'lucide-react';

function App() {
  const [formData, setFormData] = useState({
    kampagnetype: 'Leads',
    produkt: '',
    målgruppe: 'Laboratorier',
    tilbud: '',
    cta: 'Kontakt os for rådgivning',
    antal_varianter: 5
  });

  const [generatedAds, setGeneratedAds] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const kampagnetyper = ['Leads', 'Trafik', 'Brand Awareness', 'Konverteringer'];
  const målgrupper = ['Laboratorier', 'Hospitaler', 'Forskningsinstitutter', 'Kvalitetssikring', 'Offentlige institutioner', 'Private virksomheder', 'Lægepraksis', 'Privathospitaler', 'Private psykiatriske klinikker', 'Private klinikker'];
  const ctaOptions = ['Kontakt os for rådgivning', 'Opret gratis brugerprofil', 'Modtag gratis vareprøver', 'Køb direkte på webshop', 'Vi sidder klar til at hjælpe'];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Målgruppe-specifikke templates
  const getTargetGroupTemplates = (målgruppe) => {
    const baseTemplates = {
      'Laboratorier': {
        fokus: 'præcision og sporbarhed',
        fordele: 'certificerede produkter og tekniske specs',
        pain_points: 'kvalitetssikring og compliance',
        tone: 'teknisk og præcis'
      },
      'Hospitaler': {
        fokus: 'patientsikkerhed og drift',
        fordele: 'pålidelig levering og høj kvalitet',
        pain_points: 'uafbrudt forsyning og budget',
        tone: 'tillidsfuld og professionel'
      },
      'Forskningsinstitutter': {
        fokus: 'forskningskvalitet og innovation',
        fordele: 'europæiske leverandører og avanceret udstyr',
        pain_points: 'præcision og reproducerbarhed',
        tone: 'videnskabelig og innovativ'
      },
      'Lægepraksis': {
        fokus: 'effektiv drift og patientservice',
        fordele: 'nem bestilling og hurtig levering',
        pain_points: 'tid og administrative byrder',
        tone: 'praktisk og serviceorienteret'
      },
      'Privathospitaler': {
        fokus: 'premium kvalitet og service',
        fordele: 'skræddersyede løsninger og personlig service',
        pain_points: 'konkurrencedygtige priser på premium produkter',
        tone: 'eksklusiv og kvalitetsbevidst'
      },
      'Private klinikker': {
        fokus: 'specialiseret udstyr og fleksibilitet',
        fordele: 'hurtig levering og teknisk support',
        pain_points: 'specialiserede behov og cost-efficiency',
        tone: 'fleksibel og supportiv'
      },
      'Kvalitetssikring': {
        fokus: 'compliance og dokumentation',
        fordele: 'certificerede produkter og sporbarhed',
        pain_points: 'regulatoriske krav og standarder',
        tone: 'pålidelig og compliance-fokuseret'
      },
      'Offentlige institutioner': {
        fokus: 'ansvarlig indkøb og dokumentation',
        fordele: 'konkurrencedygtige priser og aftaler',
        pain_points: 'budget og offentlige indkøbsregler',
        tone: 'transparent og ansvarlig'
      },
      'Private virksomheder': {
        fokus: 'business value og ROI',
        fordele: 'cost-effective løsninger og service',
        pain_points: 'omkostningsoptimering og effektivitet',
        tone: 'business-orienteret og effektiv'
      }
    };

    return baseTemplates[målgruppe] || baseTemplates['Laboratorier'];
  };

  const generateAdTexts = async () => {
    setIsGenerating(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));

    const targetProfile = getTargetGroupTemplates(formData.målgruppe);
    const produktText = formData.produkt || 'laboratorieudstyr';
    const tilbudText = formData.tilbud ? ` ${formData.tilbud}` : '';

    const templates = {
      introduktion: [
        `${produktText} til ${formData.målgruppe.toLowerCase()} - Enkelt siden 1973. Fokus på ${targetProfile.fokus}${tilbudText}`,
        `Over 50 års erfaring med ${targetProfile.fordele}. Dansk partner til ${formData.målgruppe.toLowerCase()}${tilbudText}`,
        `Danmarks største varelager af ${produktText}. Specialiseret i ${targetProfile.fokus} til ${formData.målgruppe.toLowerCase()}${tilbudText}`,
        `Dag-til-dag levering og dansk support. ${targetProfile.fordele} til ${formData.målgruppe.toLowerCase()}${tilbudText}`,
        `Skræddersyede løsninger siden 1973. Løser udfordringer med ${targetProfile.pain_points}${tilbudText}`
      ],
      overskrift: [
        `${produktText} - ${targetProfile.fokus}`,
        `Dansk Partner til ${formData.målgruppe}`,
        `50+ År med ${targetProfile.fordele}`,
        `${produktText} - Enkelt & Sikkert`,
        `Specialiseret i ${formData.målgruppe}`
      ],
      beskrivelse: [
        `Dansk virksomhed i Skanderborg med over 50 års erfaring. Vi forstår ${formData.målgruppe.toLowerCase()}s behov for ${targetProfile.fokus} og leverer ${targetProfile.fordele}.`,
        `Som specialist i ${formData.målgruppe.toLowerCase()} ved vi, hvor vigtigt ${targetProfile.pain_points} er. Vi tilbyder ${targetProfile.fordele} med dag-til-dag levering.`,
        `Nem bestilling på Hounisen.com designet til ${formData.målgruppe.toLowerCase()}. Gratis vareprøver og lagerhotelservice optimeret til jeres ${targetProfile.fokus}.`,
        `Europæiske leverandører og certificerede produkter. Fast leveringsaftale og Hounisen® Returaftale sikrer jeres ${targetProfile.fokus} uden afbrydelser.`,
        `Digital serviceløsninger tilpasset ${formData.målgruppe.toLowerCase()}. Scan & betal og personlig support til ${targetProfile.pain_points} og daglige opgaver.`
      ]
    };

    const ads = [];
    for (let i = 0; i < formData.antal_varianter; i++) {
      const introduktion = templates.introduktion[i] || templates.introduktion[i % templates.introduktion.length];
      const overskrift = templates.overskrift[i] || templates.overskrift[i % templates.overskrift.length];
      const beskrivelse = templates.beskrivelse[i] || templates.beskrivelse[i % templates.beskrivelse.length];
      
      ads.push({
        id: i + 1,
        introduktion: introduktion,
        overskrift: overskrift,
        beskrivelse: beskrivelse,
        introduktionLength: introduktion.length,
        overskriftLength: overskrift.length,
        beskrivelseLength: beskrivelse.length
      });
    }

    setGeneratedAds(ads);
    setIsGenerating(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const exportToCSV = () => {
    const headers = ['Variant', 'Introduktion', 'Overskrift', 'Beskrivelse', 'Introduktion Length', 'Overskrift Length', 'Beskrivelse Length'];
    const csvContent = [
      headers.join(','),
      ...generatedAds.map(ad => [
        `Variant ${ad.id}`,
        `"${ad.introduktion}"`,
        `"${ad.overskrift}"`,
        `"${ad.beskrivelse}"`,
        ad.introduktionLength,
        ad.overskriftLength,
        ad.beskrivelseLength
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

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">Hounisen</h1>
          <p className="text-blue-100">Automatisk LinkedIn Annonce Generator - Laboratorieudstyr</p>
        </div>

        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/3 p-6 bg-gray-50 border-r">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Settings className="mr-2" />
              Kampagne Setup
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Kampagnetype</label>
                <select
                  name="kampagnetype"
                  value={formData.kampagnetype}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {kampagnetyper.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Produkt/Service</label>
                <input
                  type="text"
                  name="produkt"
                  value={formData.produkt}
                  onChange={handleInputChange}
                  placeholder="f.eks. Laboratorieglas, Sikkerhedsudstyr"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Målgruppe</label>
                <select
                  name="målgruppe"
                  value={formData.målgruppe}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {målgrupper.map(gruppe => (
                    <option key={gruppe} value={gruppe}>{gruppe}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Særligt Tilbud (valgfrit)</label>
                <input
                  type="text"
                  name="tilbud"
                  value={formData.tilbud}
                  onChange={handleInputChange}
                  placeholder="f.eks. gratis vareprøver, mængderabat"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Call-to-Action</label>
                <select
                  name="cta"
                  value={formData.cta}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {ctaOptions.map(cta => (
                    <option key={cta} value={cta}>{cta}</option>
                  ))}
                </select>
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

              <button
                onClick={generateAdTexts}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 flex items-center justify-center"
              >
                {isGenerating && <RefreshCw className="animate-spin mr-2" />}
                {isGenerating ? 'Genererer...' : 'Generer LinkedIn Annoncer'}
              </button>
            </div>
          </div>

          <div className="lg:w-2/3 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Genererede LinkedIn Annoncer</h2>
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
                <p>Konfigurer dine indstillinger og klik "Generer LinkedIn Annoncer" for at starte</p>
              </div>
            ) : (
              <div className="space-y-6">
                {generatedAds.map((ad) => (
                  <div key={ad.id} className="bg-white border rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold mb-4 text-blue-600">Variant {ad.id}</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-sm font-medium text-gray-700">Introduktion</label>
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

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-sm font-medium text-gray-700">Overskrift</label>
                          <span className={`text-xs px-2 py-1 rounded ${ad.overskriftLength <= 100 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {ad.overskriftLength}/100 tegn
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

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-sm font-medium text-gray-700">Beskrivelse</label>
                          <span className={`text-xs px-2 py-1 rounded ${ad.beskrivelseLength <= 600 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {ad.beskrivelseLength}/600 tegn
                          </span>
                        </div>
                        <div className="relative">
                          <textarea
                            value={ad.beskrivelse}
                            readOnly
                            className="w-full p-3 border rounded-lg bg-gray-50 resize-none"
                            rows={4}
                          />
                          <button
                            onClick={() => copyToClipboard(ad.beskrivelse)}
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

        <div className="bg-gray-50 p-6 border-t">
          <h3 className="font-semibold mb-3">Hounisen Brand Guidelines</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <strong>Tone of Voice:</strong> Professionel, serviceorienteret, troværdig, inviterende og pædagogisk
            </div>
            <div>
              <strong>Brand Values:</strong> Service, kvalitet, enkelhed og troværdighed - handlekraftige og innovative
            </div>
            <div>
              <strong>Målgruppe:</strong> Laboratorier, hospitaler, forskningsinstitutter og offentlige institutioner
            </div>
            <div>
              <strong>Konkurrencefordele:</strong> Over 50 års erfaring, dansk support, dag-til-dag levering, størst på markedet
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
