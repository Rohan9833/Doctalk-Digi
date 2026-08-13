import React from "react";
import ReactECharts from "echarts-for-react";
import { ChevronDown, CalendarDays } from "lucide-react";

function QRAnalytics({
  data = [],
  loading,
  range,
  setRange,
  topCities = [],
  totalScans = 0,
  locationLoading,
}) {
  // =====================================================
  // QR SCANS DATA
  // =====================================================

  const scanDates = data.map((item) => item.date);

  const scanValues = data.map((item) => item.scans);


  // =====================================================
  // QR GRAPH Y-AXIS
  // =====================================================

  const maxScanValue =
    scanValues.length > 0
      ? Math.max(...scanValues)
      : 0;

  const calculateYAxisMax = (value) => {
    if (value <= 1000) return 1000;
    if (value <= 2000) return 2000;
    if (value <= 5000) return 5000;
    if (value <= 10000) return 10000;
    if (value <= 20000) return 20000;
    if (value <= 50000) return 50000;

    return Math.ceil(value / 10000) * 10000;
  };

  const yAxisMax = calculateYAxisMax(maxScanValue);

  const yAxisInterval = yAxisMax / 4;


  // =====================================================
  // LINE CHART
  // =====================================================

  const lineChartOption = {
    animation: true,

    grid: {
      left: 35,
      right: 15,
      top: 10,
      bottom: 28,
    },

    tooltip: {
      trigger: "axis",

      backgroundColor: "#ffffff",
      borderColor: "#e5e7eb",
      borderWidth: 1,

      textStyle: {
        color: "#17203a",
        fontSize: 11,
      },

      formatter: function (params) {
        const item = params[0];

        if (!item) {
          return "";
        }

        return `
          <div style="font-size:10px;color:#6b7280;margin-bottom:3px">
            ${item.axisValue}
          </div>

          <div style="font-size:11px;font-weight:600;color:#17203a">
            Scans: ${Number(item.value).toLocaleString()}
          </div>
        `;
      },
    },

    xAxis: {
      type: "category",

      data: scanDates,

      boundaryGap: false,

      axisLine: {
        lineStyle: {
          color: "#edf0f4",
        },
      },

      axisTick: {
        show: false,
      },

      axisLabel: {
        color: "#8b93a3",
        fontSize: 9,

        formatter: function (value) {
          if (!value) return "";

          const date = new Date(value);

          if (isNaN(date.getTime())) {
            return value;
          }

          return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
          });
        },
      },
    },

    yAxis: {
      type: "value",

      min: 0,

      max: yAxisMax,

      interval: yAxisInterval,

      axisLine: {
        show: false,
      },

      axisTick: {
        show: false,
      },

      axisLabel: {
        color: "#8b93a3",
        fontSize: 9,

        formatter: function (value) {
          if (value === 0) {
            return "0";
          }

          if (value >= 1000000) {
            return `${value / 1000000}M`;
          }

          if (value >= 1000) {
            return `${value / 1000}K`;
          }

          return value;
        },
      },

      splitLine: {
        lineStyle: {
          color: "#eef0f4",
          type: "dashed",
        },
      },
    },

    series: [
      {
        name: "Scans",

        type: "line",

        data: scanValues,

        smooth: false,

        symbol: "circle",

        symbolSize: 6,

        lineStyle: {
          width: 2,
          color: "#5746e8",
        },

        itemStyle: {
          color: "#ffffff",
          borderColor: "#5746e8",
          borderWidth: 2,
        },

        areaStyle: {
          color: {
            type: "linear",

            x: 0,
            y: 0,
            x2: 0,
            y2: 1,

            colorStops: [
              {
                offset: 0,
                color: "rgba(87, 70, 232, 0.14)",
              },
              {
                offset: 1,
                color: "rgba(87, 70, 232, 0)",
              },
            ],
          },
        },
      },
    ],
  };


  // =====================================================
  // TOP LOCATIONS
  // =====================================================

  const topCityScans = topCities.reduce(
    (total, city) => total + Number(city.scans || 0),
    0
  );

  const othersScans = Math.max(
    Number(totalScans || 0) - topCityScans,
    0
  );


  // =====================================================
  // FORMAT LOCATION DATA
  // =====================================================

  const locationData = [
    ...topCities.map((city) => ({
      name: `${city.city}, ${city.state}`,

      scans: Number(city.scans || 0),

      value:
        totalScans > 0
          ? Number(
            (
              (Number(city.scans || 0) /
                Number(totalScans)) *
              100
            ).toFixed(1)
          )
          : 0,
    })),

    ...(othersScans > 0
      ? [
        {
          name: "Others",

          scans: othersScans,

          value:
            totalScans > 0
              ? Number(
                (
                  (othersScans /
                    Number(totalScans)) *
                  100
                ).toFixed(1)
              )
              : 0,
        },
      ]
      : []),
  ];


  // =====================================================
  // DONUT CHART
  // =====================================================

  const donutChartOption = {
    animation: true,

    tooltip: {
      trigger: "item",

      formatter: function (params) {
        return `
          <div style="font-size:10px;color:#6b7280;margin-bottom:3px">
            ${params.name}
          </div>

          <div style="font-size:11px;font-weight:600;color:#17203a">
            Scans: ${Number(params.value).toLocaleString()}
          </div>

          <div style="font-size:10px;color:#6b7280;margin-top:2px">
            ${params.percent}%
          </div>
        `;
      },

      backgroundColor: "#ffffff",
      borderColor: "#e5e7eb",

      textStyle: {
        color: "#17203a",
        fontSize: 10,
      },
    },

    series: [
      {
        name: "Locations",

        type: "pie",

        radius: ["52%", "76%"],

        center: ["50%", "50%"],

        avoidLabelOverlap: false,

        itemStyle: {
          borderColor: "#ffffff",
          borderWidth: 2,
        },

        label: {
          show: false,
        },

        labelLine: {
          show: false,
        },

        data: locationData,
      },
    ],
  };


  // =====================================================
  // LOCATION COLORS
  // =====================================================

  const locationColors = [
    "#5146e5",
    "#3b82f6",
    "#6366f1",
    "#247f98",
    "#b7becb",
    "#d1d5db",
  ];


  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="w-full bg-[#f8f9fc] p-3">

      <div
        className="
          grid
          grid-cols-1
          gap-3
          xl:grid-cols-[minmax(0,2fr)_minmax(250px,0.9fr)_220px]
        "
      >

        {/* =====================================================
            QR SCANS OVER TIME
        ====================================================== */}

        <div
          className="
            rounded-lg
            border
            border-gray-200
            bg-white
            p-4
            shadow-[0_2px_8px_rgba(0,0,0,0.03)]
          "
        >

          {/* Header */}

          <div className="mb-2 flex items-center justify-between">

            <h2 className="text-[13px] font-semibold text-[#17203a]">
              QR Scans Over Time
            </h2>


            {/* Range */}

            <div className="relative">

              <select
                value={range}
                onChange={(e) => setRange(e.target.value)}
                className="
                  appearance-none
                  rounded-md
                  border
                  border-gray-200
                  bg-white
                  px-3
                  py-1.5
                  pr-8
                  text-[10px]
                  font-medium
                  text-gray-600
                  outline-none
                  transition
                  focus:border-purple-400
                "
              >
                <option value="7d">
                  Last 7 Days
                </option>

                <option value="1m">
                  Last 1 Month
                </option>

                <option value="6m">
                  Last 6 Months
                </option>

                <option value="1y">
                  Last 1 Year
                </option>
              </select>

              <ChevronDown
                size={13}
                className="
                  pointer-events-none
                  absolute
                  right-2
                  top-1/2
                  -translate-y-1/2
                  text-gray-500
                "
              />

            </div>

          </div>


          {/* GRAPH */}

          {loading ? (

            <div
              className="
                flex
                h-[190px]
                items-center
                justify-center
                text-[10px]
                text-gray-400
              "
            >
              Loading scan data...
            </div>

          ) : data.length === 0 ? (

            <div
              className="
                flex
                h-[190px]
                items-center
                justify-center
                text-[10px]
                text-gray-400
              "
            >
              No scan data available.
            </div>

          ) : (

            <ReactECharts
              option={lineChartOption}
              style={{
                width: "100%",
                height: "190px",
              }}
              opts={{
                renderer: "canvas",
              }}
            />

          )}

        </div>


        {/* =====================================================
            TOP LOCATIONS
        ====================================================== */}

        <div
          className="
            rounded-lg
            border
            border-gray-200
            bg-white
            p-4
            shadow-[0_2px_8px_rgba(0,0,0,0.03)]
          "
        >

          <h2 className="text-[13px] font-semibold text-[#17203a]">
            Top Locations
          </h2>


          {locationLoading ? (

            <div
              className="
                flex
                h-[170px]
                items-center
                justify-center
                text-[10px]
                text-gray-400
              "
            >
              Loading locations...
            </div>

          ) : locationData.length === 0 ? (

            <div
              className="
                flex
                h-[170px]
                items-center
                justify-center
                text-[10px]
                text-gray-400
              "
            >
              No location data available.
            </div>

          ) : (

            <>

              <div className="mt-3 flex items-center gap-3">

                {/* DONUT */}

                <ReactECharts
                  option={donutChartOption}
                  style={{
                    width: "120px",
                    height: "120px",
                    flexShrink: 0,
                  }}
                  opts={{
                    renderer: "canvas",
                  }}
                />


                {/* LOCATION LEGEND */}

                <div className="flex flex-1 flex-col gap-[8px]">

                  {locationData.map(
                    (location, index) => (

                      <div
                        key={location.name}
                        className="
                          flex
                          items-center
                          justify-between
                          gap-2
                        "
                      >

                        <div className="flex items-center gap-2">

                          <span
                            className="h-2 w-2 rounded-full"
                            style={{
                              backgroundColor:
                                locationColors[
                                index %
                                locationColors.length
                                ],
                            }}
                          />

                          <span
                            className="
                              whitespace-nowrap
                              text-[9px]
                              text-gray-600
                            "
                          >
                            {location.name}
                          </span>

                        </div>


                        <span
                          className="
                            text-[9px]
                            font-medium
                            text-gray-500
                          "
                        >
                          {location.value}%
                        </span>

                      </div>

                    )
                  )}

                </div>

              </div>


              {/* TOTAL SCANS */}

              <div className="mt-3">

                <p className="text-[9px] text-gray-500">
                  Total Scans
                </p>

                <p className="text-[16px] font-semibold text-[#17203a]">
                  {Number(totalScans || 0).toLocaleString()}
                </p>

              </div>

            </>

          )}

        </div>


        {/* =====================================================
            QR SUMMARY
        ====================================================== */}

        <div
          className="
            rounded-lg
            border
            border-gray-200
            bg-white
            p-3
            shadow-[0_2px_8px_rgba(0,0,0,0.03)]
          "
        >

          <h2 className="text-[13px] font-semibold text-[#17203a]">
            QR Summary
          </h2>


          {/* Campaign */}

          <div className="mt-4">

            <label className="mb-1 block text-[9px] font-medium text-gray-500">
              Campaign
            </label>

            <select
              defaultValue="GERD Awareness Quiz"
              className="
                h-[28px]
                w-full
                rounded-md
                border
                border-gray-200
                bg-white
                px-2
                text-[9px]
                text-gray-600
                outline-none
                focus:border-purple-400
              "
            >
              <option>
                GERD Awareness Quiz
              </option>

              <option>
                Diabetes Awareness
              </option>

              <option>
                Heart Health Campaign
              </option>
            </select>

          </div>


          {/* Doctor */}

          <div className="mt-3">

            <label className="mb-1 block text-[9px] font-medium text-gray-500">
              Doctor
            </label>

            <select
              defaultValue="All Doctors"
              className="
                h-[28px]
                w-full
                rounded-md
                border
                border-gray-200
                bg-white
                px-2
                text-[9px]
                text-gray-600
                outline-none
                focus:border-purple-400
              "
            >
              <option>
                All Doctors
              </option>

              <option>
                Dr. Manohar Lele
              </option>

              <option>
                Dr. Rajesh Sharma
              </option>
            </select>

          </div>


          {/* Status */}

          <div className="mt-3">

            <label className="mb-1 block text-[9px] font-medium text-gray-500">
              Status
            </label>

            <select
              defaultValue="All Status"
              className="
                h-[28px]
                w-full
                rounded-md
                border
                border-gray-200
                bg-white
                px-2
                text-[9px]
                text-gray-600
                outline-none
                focus:border-purple-400
              "
            >
              <option>
                All Status
              </option>

              <option>
                Active
              </option>

              <option>
                Paused
              </option>

              <option>
                Expired
              </option>
            </select>

          </div>


          {/* Date */}

          <div className="mt-3">

            <label className="mb-1 block text-[9px] font-medium text-gray-500">
              Date Range
            </label>

            <div
              className="
                flex
                h-[28px]
                items-center
                gap-2
                rounded-md
                border
                border-gray-200
                px-2
                text-[9px]
                text-gray-600
              "
            >

              <CalendarDays size={12} />

              <span>
                Select date range
              </span>

            </div>

          </div>


          {/* Buttons */}

          <div className="mt-2 flex gap-2">

            <button
              className="
                flex-1
                rounded-md
                bg-gradient-to-r
                from-purple-600
                to-violet-600
                py-1.5
                text-[9px]
                font-medium
                text-white
                shadow-sm
                shadow-purple-200
                transition
                hover:from-purple-700
                hover:to-violet-700
              "
            >
              Apply Filters
            </button>

            <button
              className="
                flex-1
                rounded-md
                border
                border-gray-200
                bg-white
                py-1.5
                text-[9px]
                font-medium
                text-gray-500
                transition
                hover:bg-gray-50
              "
            >
              Reset
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default QRAnalytics;