import { useState } from 'react';
import { FaWhatsapp, FaEnvelope, FaPhone, FaHeadset } from 'react-icons/fa';

const Support = () => {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
  });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // TODO: Enviar mensagem para a API
    setTimeout(() => {
      alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
      setFormData({ subject: '', message: '' });
      setSending(false);
    }, 1000);
  };

  const contactMethods = [
    {
      icon: FaWhatsapp,
      title: 'WhatsApp',
      description: 'Fale conosco pelo WhatsApp',
      action: 'Abrir WhatsApp',
      color: 'from-green-500 to-green-600',
      link: 'https://wa.me/5511947758725',
    },
    {
      icon: FaEnvelope,
      title: 'E-mail',
      description: 'contato@cintosfashion.com.br',
      action: 'Enviar E-mail',
      color: 'from-blue-500 to-blue-600',
      link: 'mailto:contato@cintosfashion.com.br',
    },
    {
      icon: FaPhone,
      title: 'Telefone',
      description: '(11) 947758725',
      action: 'Ligar Agora',
      color: 'from-purple-500 to-purple-600',
      link: 'tel:+5511947758725',
    },
  ];

  return (
    <div className="min-h-screen py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-dark mb-4">Atendimento</h1>
          <p className="text-slate/70 text-lg">Estamos aqui para ajudar você</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Methods */}
          <div>
            <h2 className="text-2xl font-bold text-dark mb-6">Canais de Atendimento</h2>
            <div className="space-y-4">
              {contactMethods.map((method, index) => {
                const Icon = method.icon;
                return (
                  <a
                    key={index}
                    href={method.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-white/70 backdrop-blur-xl rounded-2xl border border-blue/40 shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center`}>
                        <Icon className="text-white text-2xl" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-dark mb-1">{method.title}</h3>
                        <p className="text-slate/70 text-sm">{method.description}</p>
                      </div>
                      <div className="text-blue font-semibold">{method.action} →</div>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* FAQ Preview */}
            <div className="mt-8 bg-white/70 backdrop-blur-xl rounded-2xl border border-blue/40 shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <FaHeadset className="text-3xl text-blue" />
                <h3 className="text-xl font-bold text-dark">Perguntas Frequentes</h3>
              </div>
              <p className="text-slate/70 mb-4">
                Antes de entrar em contato, confira se sua dúvida já foi respondida nas nossas perguntas frequentes.
              </p>
              <button className="text-blue font-semibold hover:underline">
                Ver Perguntas Frequentes →
              </button>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-dark mb-6">Envie uma Mensagem</h2>
            <form onSubmit={handleSubmit} className="bg-white/70 backdrop-blur-xl rounded-2xl border border-blue/40 shadow-lg p-6">
              <div className="mb-6">
                <label htmlFor="subject" className="block text-dark font-semibold mb-2">
                  Assunto
                </label>
                <input
                  type="text"
                  id="subject"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-blue/40 focus:outline-none focus:ring-2 focus:ring-blue/50 bg-white/50"
                  placeholder="Ex: Dúvida sobre pedido"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="message" className="block text-dark font-semibold mb-2">
                  Mensagem
                </label>
                <textarea
                  id="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-blue/40 focus:outline-none focus:ring-2 focus:ring-blue/50 bg-white/50 resize-none"
                  placeholder="Descreva sua dúvida ou problema..."
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full bg-gradient-to-r from-blue to-dark text-white py-4 rounded-xl font-bold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? 'Enviando...' : 'Enviar Mensagem'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;

