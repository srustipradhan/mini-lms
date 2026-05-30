import { Text, View } from 'react-native';
import { Link } from 'expo-router';
import { Button } from '@/components/ui/Button';

export default function NotFoundScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-slate-50 px-6 dark:bg-slate-950">
      <Text className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">Page not found</Text>
      <Link href="/" asChild>
        <Button label="Go home" className="mt-4 w-full" />
      </Link>
    </View>
  );
}
