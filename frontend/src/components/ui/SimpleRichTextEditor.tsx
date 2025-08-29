'use client'

import React, { useState, useRef } from 'react'
import { Bold, Italic, Underline, List, ListOrdered } from 'lucide-react'

interface RichTextEditorProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    height?: string
}

function RichTextEditor({ value, onChange, placeholder = "Enter description...", height = "120px" }: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null)
    const [isFocused, setIsFocused] = useState(false)

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML)
        }
    }

    const handleFocus = () => {
        setIsFocused(true)
        if (editorRef.current && !value) {
            editorRef.current.innerHTML = ''
        }
    }

    const handleBlur = () => {
        setIsFocused(false)
        if (editorRef.current) {
            const content = editorRef.current.innerHTML
            if (content === '<br>' || content === '') {
                onChange('')
                editorRef.current.innerHTML = `<div class="text-gray-400">${placeholder}</div>`
            } else {
                onChange(content)
            }
        }
    }

    const execCommand = (command: string, value?: string) => {
        document.execCommand(command, false, value)
        if (editorRef.current) {
            editorRef.current.focus()
            handleInput()
        }
    }

    React.useEffect(() => {
        if (editorRef.current) {
            if (value) {
                editorRef.current.innerHTML = value
            } else if (!isFocused) {
                editorRef.current.innerHTML = `<div class="text-gray-400">${placeholder}</div>`
            }
        }
    }, [value, placeholder, isFocused])

    return (
        <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
            {/* Toolbar */}
            <div className="bg-gray-50 border-b border-gray-300 p-2 flex space-x-1">
                <button
                    type="button"
                    onClick={() => execCommand('bold')}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                    title="Bold"
                >
                    <Bold className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => execCommand('italic')}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                    title="Italic"
                >
                    <Italic className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => execCommand('underline')}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                    title="Underline"
                >
                    <Underline className="w-4 h-4" />
                </button>
                <div className="w-px bg-gray-300 mx-1" />
                <button
                    type="button"
                    onClick={() => execCommand('insertUnorderedList')}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                    title="Bullet List"
                >
                    <List className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => execCommand('insertOrderedList')}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                    title="Numbered List"
                >
                    <ListOrdered className="w-4 h-4" />
                </button>
            </div>

            {/* Editor */}
            <div
                ref={editorRef}
                contentEditable
                onFocus={handleFocus}
                onBlur={handleBlur}
                onInput={handleInput}
                className="p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                style={{ minHeight: height }}
                suppressContentEditableWarning={true}
            />
        </div>
    )
}

export default RichTextEditor
