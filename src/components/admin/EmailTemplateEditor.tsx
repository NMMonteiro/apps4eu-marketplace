'use client'

import { useState } from 'react'
import { saveEmailTemplate } from '@/app/admin/email-actions'
import { Mail, Eye, Code, Save, Loader2 } from 'lucide-react'

interface EmailTemplate {
    slug: string
    subject: string
    body: string
}

export default function EmailTemplateEditor({ initialTemplate }: { initialTemplate: EmailTemplate }) {
    const [subject, setSubject] = useState(initialTemplate.subject)
    const [body, setBody] = useState(initialTemplate.body)
    const [view, setView] = useState<'edit' | 'preview'>('edit')
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState('')

    const handleSave = async () => {
        setSaving(true)
        setMessage('')
        try {
            await saveEmailTemplate(initialTemplate.slug, subject, body)
            setMessage('Template saved successfully!')
        } catch (err) {
            setMessage('Error saving template.')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2 font-semibold text-brand-navy">
                    <Mail className="w-5 h-5" />
                    Email Template: {initialTemplate.slug}
                </div>
                <div className="flex bg-white border rounded-lg p-1">
                    <button
                        onClick={() => setView('edit')}
                        className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${view === 'edit' ? 'bg-brand-navy text-white' : 'hover:bg-slate-50 text-brand-slate'}`}
                    >
                        <Code className="w-3 h-3" />
                        Editor
                    </button>
                    <button
                        onClick={() => setView('preview')}
                        className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${view === 'preview' ? 'bg-brand-navy text-white' : 'hover:bg-slate-50 text-brand-slate'}`}
                    >
                        <Eye className="w-3 h-3" />
                        Preview
                    </button>
                </div>
            </div>

            <div className="p-6 space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-brand-navy">Subject Line</label>
                    <input
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-brand-navy outline-none"
                        placeholder="e.g. Welcome to Apps4EU Marketplace!"
                    />
                </div>

                {view === 'edit' ? (
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-brand-navy">HTML Body</label>
                        <textarea
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-brand-navy outline-none h-64 font-mono text-sm leading-relaxed"
                            placeholder="<h1>Hello {{email}}!</h1>..."
                        />
                        <p className="text-[10px] text-brand-slate italic">Available tags: {'{{email}}'}, {'{{link}}'}</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-brand-navy">Live Preview</label>
                        <div
                            className="w-full p-4 border rounded-lg bg-slate-50 min-h-64 overflow-auto prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: body.replace('{{email}}', 'user@example.com').replace('{{link}}', '#') }}
                        />
                    </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t mt-6">
                    <span className={`text-sm font-medium ${message.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>
                        {message}
                    </span>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-brand-navy text-white rounded-lg hover:bg-brand-navy-light disabled:opacity-50 transition-colors font-medium"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Template
                    </button>
                </div>
            </div>
        </div>
    )
}
