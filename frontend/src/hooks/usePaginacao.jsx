import { useState, useMemo, useEffect } from 'react'

export function usePaginacao(itens = [], itensPorPagina = 10) {
    const [paginaAtual, setPaginaAtual] = useState(1)

    const totalItens = itens.length
    const totalPaginas = Math.max(1, Math.ceil(totalItens / itensPorPagina))

    useEffect(() => {
        if (paginaAtual > totalPaginas) {
            setPaginaAtual(1)
        }
    }, [paginaAtual, totalPaginas])

    const itensPaginados = useMemo(() => {
        const inicio = (paginaAtual - 1) * itensPorPagina
        const fim = inicio + itensPorPagina
        return itens.slice(inicio, fim)
    }, [itens, paginaAtual, itensPorPagina])

    return {
        paginaAtual,
        setPaginaAtual,
        totalPaginas,
        totalItens,
        itensPaginados,
    }
}