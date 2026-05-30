import { memo, useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { cn } from '@/utils/cn';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export const SearchBar = memo(function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search courses, topics, instructors...',
  debounceMs = 300,
}: SearchBarProps) {
  const [inputValue, setInputValue] = useState(value);
  const debouncedInput = useDebouncedValue(inputValue, debounceMs);
  const isSearching = inputValue !== debouncedInput;

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (debouncedInput !== value) {
      onChangeText(debouncedInput);
    }
  }, [debouncedInput, onChangeText, value]);

  const handleChangeText = useCallback((text: string) => {
    setInputValue(text);
  }, []);

  return (
    <View
      className={cn(
        'mb-4 flex-row items-center rounded-2xl border border-slate-200/80 bg-white/80 px-4 dark:border-slate-700/60 dark:bg-slate-900/50',
      )}
    >
      <Ionicons name="search" size={20} color="#94A3B8" />
      <TextInput
        accessibilityLabel="Search courses"
        value={inputValue}
        onChangeText={handleChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        className="ml-2 flex-1 py-3.5 text-base text-slate-900 dark:text-white"
      />
      {isSearching ? (
        <ActivityIndicator size="small" color="#6366F1" accessibilityLabel="Searching courses" />
      ) : null}
    </View>
  );
});
