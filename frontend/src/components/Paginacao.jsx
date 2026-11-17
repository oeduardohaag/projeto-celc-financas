import { ChevronLeft, ChevronRight } from 'lucide-react'
import './Paginacao.css'

function Paginacao({ paginaAtual, totalPaginas, totalItens, onMudarPagina }) {
    if (totalItens === 0) return null

    return (
        <div className="paginacao-container">
            <span className="paginacao-info">
                Página <strong>{paginaAtual}</strong> de <strong>{totalPaginas}</strong> ({totalItens} registro{totalItens !== 1 ? 's' : ''})
            </span>

            <div className="paginacao-botoes">
                <button
                    type="button"
                    className="paginacao-btn"
                    onClick={() => onMudarPagina(paginaAtual - 1)}
                    disabled={paginaAtual <= 1}
                >
                    <ChevronLeft size={16} />
                    Anterior
                </button>

                <button
                    type="button"
                    className="paginacao-btn"
                    onClick={() => onMudarPagina(paginaAtual + 1)}
                    disabled={paginaAtual >= totalPaginas}
                >
                    Próxima
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    )
}

export default Paginacao