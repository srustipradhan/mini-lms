import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Text, View } from 'react-native';
import { Button } from '@/components/ui/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo): void {}

  private handleReset = (): void => {
    this.setState({ hasError: false });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <View className="flex-1 items-center justify-center bg-slate-50 px-6 dark:bg-slate-950">
          <Text className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">Something went wrong</Text>
          <Text className="mb-6 text-center text-slate-500 dark:text-slate-300">
            The app hit an unexpected error. You can try again.
          </Text>
          <Button label="Try again" onPress={this.handleReset} className="w-full" />
        </View>
      );
    }

    return this.props.children;
  }
}
