import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function Heatmap({ data }) {
  const svgRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!data || !wrapperRef.current) return;
    
    // Clear previous render
    d3.select(svgRef.current).selectAll("*").remove();

    const { matrix, paths, seq1, seq2 } = data;
    const m = matrix.length;
    const n = matrix[0].length;

    // Dimensions
    const size = Math.min(wrapperRef.current.clientWidth / n, 50); 
    const width = n * size;
    const height = m * size;

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Color scale mapping 0 to max score
    const maxScore = d3.max(matrix.flat());
    const colorScale = d3.scaleSequential()
      .interpolator(d3.interpolateViridis)
      .domain([0, maxScore || 1]);

    // Draw Matrix Cells
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        const isPath = paths.some(p => p[0] === i && p[1] === j);
        const cell = svg.append("g")
          .attr("transform", `translate(${j * size}, ${i * size})`);

        cell.append("rect")
          .attr("width", size - 2)
          .attr("height", size - 2)
          .attr("rx", 6)
          .attr("fill", isPath ? "var(--path-color)" : colorScale(matrix[i][j]))
          .attr("stroke", isPath ? "white" : "rgba(255,255,255,0.05)")
          .attr("stroke-width", isPath ? 2 : 1)
          .style("transition", "all 0.3s ease")
          .on("mouseover", function() {
            d3.select(this).attr("stroke", "white").attr("stroke-width", 2);
          })
          .on("mouseout", function() {
            if(!isPath) d3.select(this).attr("stroke", "none");
          });

        cell.append("text")
          .attr("x", size / 2)
          .attr("y", size / 2)
          .attr("dy", "0.35em")
          .attr("text-anchor", "middle")
          .attr("fill", isPath ? "black" : "white")
          .style("font-size", `${size * 0.3}px`)
          .style("font-weight", isPath ? "bold" : "normal")
          .style("pointer-events", "none")
          .text(matrix[i][j]);
      }
    }

    // Sequence Headers
    for (let i = 1; i < m; i++) {
        svg.append("text")
          .attr("x", size / 2 * 0.5)
          .attr("y", i * size + size / 2)
          .attr("dy", "0.35em")
          .attr("fill", "var(--accent-primary)")
          .style("font-weight", "bold")
          .text(seq1[i-1]);
    }
    
    for (let j = 1; j < n; j++) {
        svg.append("text")
          .attr("x", j * size + size / 2)
          .attr("y", size / 2 * 0.5)
          .attr("text-anchor", "middle")
          .attr("fill", "var(--accent-primary)")
          .style("font-weight", "bold")
          .text(seq2[j-1]);
    }

  }, [data]);

  return (
    <div ref={wrapperRef} style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'auto' }}>
      <svg ref={svgRef}></svg>
    </div>
  );
}
