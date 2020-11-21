import {
  D3_TRANSITION_DURATION,
  MAP_META,
  MAP_TYPES,
  MAP_VIEWS,
  MAP_VIZS,
  STATE_CODES,
  STATE_NAMES,
  STATISTIC_CONFIGS,
  UNKNOWN_DISTRICT_KEY,
} from '../../constants';
import {json} from 'd3-fetch';
import {geoIdentity, geoPath} from 'd3-geo';
// eslint-disable-next-line
// import worker from 'workerize-loader!../workers/mapVisualizer';
import {select, event} from 'd3-selection';
import {transition} from 'd3-transition';
import React, {useCallback, useEffect, useMemo, useRef,useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router-dom';
import useSWR from 'swr';
import * as topojson from 'topojson';

const [width, height] = [432, 488];


function MapVisualizer({
  mapCode,
  mapView,
  mapViz
}) {

  const [regionHighlighted, setRegionHighlighted] = useState({
    stateCode: 'GJ',
    districtName: null,
  });

  const {t} = useTranslation();
  const svgRef = useRef(null);

  const mapMeta = MAP_META[mapCode];
  const history = useHistory();

  const {data: geoData} = useSWR(
    '/maps/gujarat.json',
    async (file) => {
      return await json(file);
    },
    {suspense: false, revalidateOnFocus: false}
  );


  const path = useMemo(() => {
    if (!geoData) return null;
    return geoPath(geoIdentity());
  }, [geoData]);

  const fillColor = useCallback(
    (d) => {
      const color = '#393c59';
      return color;
    }
  );

  const strokeColor = useCallback(
    (alpha) => {
      return "#00d6b4" + alpha;
    }
  );

  const features = useMemo(() => {
    if (!geoData) return null;
    const featuresWrap =
      mapView === MAP_VIEWS.STATES
        ? topojson.feature(geoData, geoData.objects.states).features
        : mapMeta.mapType === MAP_TYPES.COUNTRY && mapViz === MAP_VIZS.BUBBLES
        ? [
            ...topojson.feature(geoData, geoData.objects.states).features,
            ...topojson.feature(geoData, geoData.objects.districts).features,
          ]
        : topojson.feature(geoData, geoData.objects.districts).features;

    // Add id to each feature
    return featuresWrap.map((feature) => {
      const district = feature.properties.district;
      const state = feature.properties.st_nm;
      const obj = Object.assign({}, feature);
      obj.id = `${mapCode}-${state}${district ? '-' + district : ''}`;
      return obj;
    });
  }, [geoData, mapCode, mapView, mapViz, mapMeta]);

  const onceTouchedRegion = useRef(null);

  // Reset on tapping outside map
  useEffect(() => {
    const svg = select(svgRef.current);
    svg.attr('pointer-events', 'auto').on('click', () => {
      onceTouchedRegion.current = null;
      setRegionHighlighted({
        stateCode: mapCode,
        districtName: null,
      });
    });
  }, [mapCode, setRegionHighlighted]);

  // Choropleth
  useEffect(() => {
    if (!geoData) return;
    const svg = select(svgRef.current);
    const T = transition().duration(D3_TRANSITION_DURATION);

    const regionSelection = svg
      .select('.regions')
      .selectAll('path')
      .data(mapViz !== MAP_VIZS.BUBBLES ? features : [], (d) => d.id)
      .join(
        (enter) =>
          enter
            .append('path')
            .attr('d', path)
            .attr('stroke-width', 1.8)
            .attr('stroke-opacity', 0)
            .style('cursor', 'pointer')
            .on('mouseenter', (d) => {
              setRegionHighlighted({
                stateCode: STATE_CODES[d.properties.st_nm],
                districtName: d.properties.district,
              });
            })
            .attr('fill', '#fff0')
            .attr('stroke', '#fff0')
            .call((enter) => {
              enter.append('title');
            }),
        (update) => update,
        (exit) =>
          exit
            .transition(T)
            .attr('stroke', '#fff0')
            .attr('fill', '#fff0')
            .remove()
      )
      .attr('pointer-events', 'all')
      .on('touchstart', (d) => {
        if (onceTouchedRegion.current === d) onceTouchedRegion.current = null;
        else onceTouchedRegion.current = d;
      })
      .on('click', (d) => {
        event.stopPropagation();

        const distname = d.properties.district;
        // Disable pointer events till the new map is rendered
        svg.attr('pointer-events', 'none');
        svg.select('.regions').selectAll('path').attr('pointer-events', 'none');
        // Switch map
        console.log(d);
        history.push( `/admin/district/${distname}`);

      })
      .call((sel) => {
        sel
          .transition(T)
          .attr('fill', fillColor)
          .attr('stroke', strokeColor.bind(this, ''));
      });

    window.requestIdleCallback(() => {
    });
  }, [
    mapViz,
    features,
    fillColor,
    geoData,
    history,
    mapMeta.mapType,
    path,
    setRegionHighlighted,
    strokeColor,
  ]);

  // Boundaries
  useEffect(() => {
    if (!geoData) return;
    const svg = select(svgRef.current);
    const T = transition().duration(D3_TRANSITION_DURATION);

    let meshStates = [];
    let meshDistricts = [];

    if (mapMeta.mapType === MAP_TYPES.COUNTRY) {
      meshStates = [topojson.mesh(geoData, geoData.objects.states)];
      meshStates[0].id = `${mapCode}-states`;
    }

    if (
      mapMeta.mapType === MAP_TYPES.STATE ||
      (mapView === MAP_VIEWS.DISTRICTS && mapViz === MAP_VIZS.CHOROPLETH)
    ) {
      // Add id to mesh
      meshDistricts = [topojson.mesh(geoData, geoData.objects.districts)];
      meshDistricts[0].id = `${mapCode}-districts`;
    }

    svg
      .select('.district-borders')
      .attr('fill', 'none')
      .attr('stroke-width', 1.5)
      .selectAll('path')
      .data(meshDistricts, (d) => d.id)
      .join(
        (enter) =>
          enter
            .append('path')
            .attr('d', path)
            .attr('d', path)
            .attr('stroke', '#fff0'),
        (update) => update,
        (exit) => exit.transition(T).attr('stroke', '#fff0').remove()
      )
      .transition(T)
      .attr('stroke', strokeColor.bind(this, '40'));
  }, [
    geoData,
    mapMeta,
    mapCode,
    mapViz,
    mapView,
    path,
    strokeColor,
  ]);

  // Highlight
  useEffect(() => {
    const stateCode = regionHighlighted.stateCode;
    const stateName = STATE_NAMES[stateCode];
    const district = regionHighlighted.districtName;

    console.log(stateName,district)

    const svg = select(svgRef.current);

    if (mapViz === MAP_VIZS.BUBBLES) {
      svg
        .select('.circles')
        .selectAll('circle')
        .attr('fill-opacity', (d) => {
          const highlighted =
            stateName === d.properties.st_nm &&
            ((!district && stateCode !== mapCode) ||
              district === d.properties?.district ||
              mapView === MAP_VIEWS.STATES ||
              (district === UNKNOWN_DISTRICT_KEY && !d.properties.district));
          return highlighted ? 1 : 0.25;
        });
    } else {
      svg
        .select('.regions')
        .selectAll('path')
        .each(function (d) {
          const highlighted =
            stateName === d.properties.st_nm &&
            ((!district && stateCode !== mapCode) ||
              district === d.properties?.district ||
              mapView === MAP_VIEWS.STATES);
          if (highlighted) this.parentNode.appendChild(this);
          select(this).attr('stroke-opacity', highlighted ? 1 : 0);
        });
    }
  }, [
    geoData,
    mapCode,
    mapView,
    mapViz,
    regionHighlighted.stateCode,
    regionHighlighted.districtName,
  ]);

  return (
    <React.Fragment>
      <div className="svg-parent">
        <svg
          id="chart"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="xMidYMid meet"
          ref={svgRef}
        >
          <g className="regions" />
          <g className="state-borders" />
          <g className="district-borders" />
          <g className="circles" />
        </svg>
      </div>

    </React.Fragment>
  );
}

export default MapVisualizer;
