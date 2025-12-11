import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useFilters } from "@/hooks/useFilter";
import { useYear } from "@/hooks/useYears";
import { useQuery } from "convex/react";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import * as colors from "tailwindcss/colors";

const FilterSection = () => {
  const { years } = useYear();
  const { filters, setFilters } = useFilters();
  const [selectedYear, setSelectedYear] = useState<Id<"years">>(years[0].yearId as Id<"years">);
  //   const [selectedSeason, setSelectedSeason] = useState<Id<"seasons"> | undefined>(filters.seasonId);
  const [seasonOptions, setSeasonOptions] = useState<{ label: string; value: Id<"seasons"> }[]>([]);

  const yearsOptions = years.map((y) => ({ label: y.year, value: y.yearId }));

  const seasons =
    useQuery(api.seasons.getSeasonsByYear, selectedYear ? { yearId: selectedYear } : "skip") ?? [];

  useEffect(() => {
    if (years && seasons && seasons.length > 0) {
      const options = seasons
        .filter((s) => !!s) // ensures s is defined
        .map((s) => ({ label: s.season, value: s._id }));

      setSeasonOptions(options);
      //   setSelectedSeason(seasons[0]?._id as Id<"seasons">);
      setFilters((prev) => ({ ...prev, seasonId: seasons[0]?._id as Id<"seasons"> }));
    }
  }, [seasons, years]);

  const handleChange = (f: Id<"seasons">) => {
    setFilters((prev) => ({
      ...prev,
      seasonId: f,
    }));
  };

  return (
    <View className="bg-slate-900">
      <View className="flex-row">
        <View className="w-1/2">
          {/* <Text className="text-sm uppercase text-slate-400 font-semibold pb-1">by year</Text> */}
          <Dropdown
            data={yearsOptions}
            labelField="label"
            valueField="value"
            placeholder="Select Year"
            value={selectedYear}
            onChange={(item) => {
              setSelectedYear(item.value);
            }}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 10,
            }}
            selectedTextStyle={{ fontSize: 18, color: colors.slate[300] }}
            placeholderStyle={{ color: colors.slate[300] }}
          />
        </View>

        <View className="w-1/2">
          {selectedYear && (
            <>
              {/* <Text className="text-sm uppercase text-slate-400 font-semibold pb-1">by season</Text> */}
              <View>
                {!filters.seasonId ?
                  <ActivityIndicator size="small" color={colors.slate[400]} />
                : <Dropdown
                    // placeholder="Select Season"
                    data={seasonOptions}
                    labelField="label"
                    valueField="value"
                    value={filters.seasonId}
                    onChange={(item) => handleChange(item.value)}
                    style={{
                      padding: 10,
                    }}
                    selectedTextStyle={{ fontSize: 18, color: colors.slate[300] }}
                    placeholderStyle={{ color: colors.slate[300] }}
                  />
                }
              </View>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

export default FilterSection;
