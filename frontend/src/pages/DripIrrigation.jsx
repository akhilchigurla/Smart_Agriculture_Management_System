import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const DripIrrigation = () => {
  const { t } = useTranslation();
  const [area, setArea] = useState('');
  const [cropType, setCropType] = useState('tomato');
  const [calculation, setCalculation] = useState(null);

  const cropData = {
    tomato: { name: t('irrigation.table.tomato', { defaultValue: 'Tomato' }), factor: 0.4, req: t('irrigation.table.medium', { defaultValue: 'Medium' }) },
    cotton: { name: t('irrigation.table.cotton', { defaultValue: 'Cotton' }), factor: 0.5, req: t('irrigation.table.medium', { defaultValue: 'Medium' }) },
    sugarcane: { name: t('irrigation.table.sugarcane', { defaultValue: 'Sugarcane' }), factor: 0.8, req: t('irrigation.table.high', { defaultValue: 'High' }) },
    grapes: { name: t('irrigation.table.grapes', { defaultValue: 'Grapes' }), factor: 0.35, req: t('irrigation.table.medium', { defaultValue: 'Medium' }) },
    banana: { name: t('irrigation.table.banana', { defaultValue: 'Banana' }), factor: 0.75, req: t('irrigation.table.high', { defaultValue: 'High' }) }
  };

  const calculateSavings = (e) => {
    e.preventDefault();
    if (!area || area <= 0) return;

    const normalUsage = area * 1000;
    const dripUsage = normalUsage * cropData[cropType].factor;
    const saved = normalUsage - dripUsage;

    setCalculation({
      normal: normalUsage.toFixed(0),
      drip: dripUsage.toFixed(0),
      saved: saved.toFixed(0)
    });
  };

  return (
    <div className="container" style={{ marginTop: '40px', paddingBottom: '60px' }}>
      <header className="fade-in" style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ color: 'var(--primary-dark)', fontSize: '2.5rem', marginBottom: '15px' }}>{t('irrigation.title')}</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '800px', margin: '0 auto', fontSize: '1.1rem' }}>
          {t('irrigation.intro')}
        </p>
      </header>

      {/* Benefits Section */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ color: 'var(--primary)', marginBottom: '30px', textAlign: 'center' }}>{t('irrigation.benefits_title')}</h2>
        <div className="grid grid-3">
          {[
            { title: t('irrigation.benefits.water_saving.title'), desc: t('irrigation.benefits.water_saving.desc'), icon: '🌊' },
            { title: t('irrigation.benefits.weed_reduction.title'), desc: t('irrigation.benefits.weed_reduction.desc'), icon: '🌿' },
            { title: t('irrigation.benefits.yield_improvement.title'), desc: t('irrigation.benefits.yield_improvement.desc'), icon: '📈' },
            { title: t('irrigation.benefits.soil_erosion.title'), desc: t('irrigation.benefits.soil_erosion.desc'), icon: '🌍' },
            { title: t('irrigation.benefits.fert_efficiency.title'), desc: t('irrigation.benefits.fert_efficiency.desc'), icon: '🧪' },
            { title: t('irrigation.benefits.energy_saving.title'), desc: t('irrigation.benefits.energy_saving.desc'), icon: '⚡' }
          ].map((benefit, i) => (
            <div key={i} className="glass-panel fade-in" style={{ padding: '25px', textAlign: 'center', transition: 'transform 0.3s ease' }}>
              <div style={{ fontSize: '30px', marginBottom: '15px' }}>{benefit.icon}</div>
              <h3 style={{ marginBottom: '10px', color: 'var(--primary-dark)' }}>{benefit.title}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Crop Suitability Table */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ color: 'var(--primary)', marginBottom: '30px', textAlign: 'center' }}>{t('irrigation.suitable_crops')}</h2>
        <div className="glass-panel fade-in" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
                <th style={{ padding: '15px 20px' }}>{t('irrigation.table.crop')}</th>
                <th style={{ padding: '15px 20px' }}>{t('irrigation.table.requirement')}</th>
                <th style={{ padding: '15px 20px' }}>{t('irrigation.table.suitable')}</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(cropData).map((key, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '15px 20px', fontWeight: '600' }}>{t(`irrigation.table.${key}`)}</td>
                  <td style={{ padding: '15px 20px' }}>{t(`irrigation.table.${cropData[key].req.toLowerCase()}`)}</td>
                  <td style={{ padding: '15px 20px', color: '#2e7d32', fontWeight: 'bold' }}>{t('irrigation.table.yes')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid grid-2" style={{ gap: '40px' }}>
        {/* Components & Guide */}
        <section>
          <h2 style={{ color: 'var(--primary)', marginBottom: '25px' }}>{t('irrigation.components_title')}</h2>
          <div className="glass-panel" style={{ padding: '25px' }}>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {[
                { name: t('irrigation.components.pump.name', { defaultValue: 'Water Pump' }), desc: t('irrigation.components.pump.desc', { defaultValue: 'The heart of the system, providing pressure.' }) },
                { name: t('irrigation.components.filters.name', { defaultValue: 'Filters' }), desc: t('irrigation.components.filters.desc', { defaultValue: 'Prevents emitters from clogging with debris.' }) },
                { name: t('irrigation.components.valves.name', { defaultValue: 'Control Valves' }), desc: t('irrigation.components.valves.desc', { defaultValue: 'Regulates the flow of water to zones.' }) },
                { name: t('irrigation.components.pipeline.name', { defaultValue: 'Main Pipeline' }), desc: t('irrigation.components.pipeline.desc', { defaultValue: 'Carries water to the field areas.' }) },
                { name: t('irrigation.components.emitters.name', { defaultValue: 'Drip Emitters' }), desc: t('irrigation.components.emitters.desc', { defaultValue: 'Delivers water precisely to individual plants.' }) }
              ].map((comp, i) => (
                <li key={i} style={{ marginBottom: '15px', borderBottom: '1px solid #efefef', paddingBottom: '10px' }}>
                  <strong style={{ color: 'var(--primary-dark)' }}>{comp.name}:</strong> {comp.desc}
                </li>
              ))}
            </ul>
            <div style={{ marginTop: '30px' }}>
              <h3 style={{ color: 'var(--primary)', marginBottom: '15px' }}>{t('irrigation.installation_title')}</h3>
              <ol style={{ paddingLeft: '20px' }}>
                <li>{t('irrigation.guide.step1')}</li>
                <li>{t('irrigation.guide.step2')}</li>
                <li>{t('irrigation.guide.step3')}</li>
                <li>{t('irrigation.guide.step4')}</li>
                <li>{t('irrigation.guide.step5')}</li>
              </ol>
            </div>
          </div>
        </section>

        {/* Water Saving Calculator */}
        <section>
          <h2 style={{ color: 'var(--primary)', marginBottom: '25px' }}>{t('irrigation.calculator_title')}</h2>
          <div className="glass-panel" style={{ padding: '30px' }}>
            <form onSubmit={calculateSavings}>
              <div className="form-group">
                <label>{t('irrigation.calculator.land_area')}</label>
                <input 
                  type="number" 
                  className="form-control" 
                  placeholder="e.g. 5" 
                  value={area} 
                  onChange={(e) => setArea(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label>{t('irrigation.calculator.crop_type')}</label>
                <select 
                  className="form-control" 
                  value={cropType} 
                  onChange={(e) => setCropType(e.target.value)}
                >
                  {Object.keys(cropData).map(key => (
                    <option key={key} value={key}>{t(`irrigation.table.${key}`)}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn" style={{ width: '100%' }}>{t('irrigation.calculator.calculate')}</button>
            </form>

            {calculation && (
              <div className="fade-in" style={{ marginTop: '30px', padding: '20px', borderRadius: '12px', background: 'rgba(46, 125, 50, 0.05)', border: '1px solid var(--primary-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span>{t('irrigation.calculator.traditional')}</span>
                  <span style={{ fontWeight: 'bold' }}>{calculation.normal} L/day</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span>{t('irrigation.calculator.drip')}</span>
                  <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{calculation.drip} L/day</span>
                </div>
                <hr style={{ margin: '15px 0', border: 'none', borderTop: '1px solid #ddd' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', color: 'var(--primary-dark)', fontWeight: '800' }}>
                  <span>{t('irrigation.calculator.total_saved')}</span>
                  <span>{calculation.saved} L/day</span>
                </div>
              </div>
            )}
            <p style={{ marginTop: '20px', fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              {t('irrigation.calculator.note')}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DripIrrigation;
