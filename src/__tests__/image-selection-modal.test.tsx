/**
 * Tests für ImageSelectionModal (FIX #2)
 *
 * Testet:
 * - Modal rendering with images
 * - User selection logic
 * - Retry/Skip buttons
 * - No images state
 * - Navigation between images
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ImageSelectionModal, type SearchResult } from '../components/ImageSelectionModal';

// Mock search results
const mockResults: SearchResult[] = [
  {
    url: 'https://example.com/image1.jpg',
    thumb: 'https://example.com/thumb1.jpg',
    alt: 'Pasta Carbonara',
    source: 'unsplash',
  },
  {
    url: 'https://example.com/image2.jpg',
    thumb: 'https://example.com/thumb2.jpg',
    alt: 'Pasta Bolognese',
    source: 'openverse',
  },
  {
    url: 'https://example.com/image3.jpg',
    thumb: 'https://example.com/thumb3.jpg',
    alt: 'Spaghetti',
    source: 'unsplash',
  },
];

describe('ImageSelectionModal', () => {
  describe('Rendering', () => {
    it('should render modal with title', () => {
      const mockHandlers = {
        onSelect: vi.fn(),
        onSkip: vi.fn(),
        onRetry: vi.fn(),
      };

      render(
        <ImageSelectionModal
          results={mockResults}
          recipeName="Pasta Carbonara"
          onSelect={mockHandlers.onSelect}
          onSkip={mockHandlers.onSkip}
          onRetry={mockHandlers.onRetry}
        />
      );

      expect(screen.getByText(/Passendes Bild wählen/i)).toBeInTheDocument();
    });

    it('should render thumbnail grid with all images', () => {
      const mockHandlers = {
        onSelect: vi.fn(),
        onSkip: vi.fn(),
        onRetry: vi.fn(),
      };

      const { container } = render(
        <ImageSelectionModal
          results={mockResults}
          recipeName="Pasta Carbonara"
          onSelect={mockHandlers.onSelect}
          onSkip={mockHandlers.onSkip}
          onRetry={mockHandlers.onRetry}
        />
      );

      const thumbnails = container.querySelectorAll('img[alt]');
      expect(thumbnails.length).toBeGreaterThanOrEqual(mockResults.length);
    });

    it('should show image counter', () => {
      const mockHandlers = {
        onSelect: vi.fn(),
        onSkip: vi.fn(),
        onRetry: vi.fn(),
      };

      render(
        <ImageSelectionModal
          results={mockResults}
          recipeName="Pasta Carbonara"
          onSelect={mockHandlers.onSelect}
          onSkip={mockHandlers.onSkip}
          onRetry={mockHandlers.onRetry}
        />
      );

      expect(screen.getByText(/1 \/ 3/i)).toBeInTheDocument();
    });

    it('should show source badge', () => {
      const mockHandlers = {
        onSelect: vi.fn(),
        onSkip: vi.fn(),
        onRetry: vi.fn(),
      };

      render(
        <ImageSelectionModal
          results={mockResults}
          recipeName="Pasta Carbonara"
          onSelect={mockHandlers.onSelect}
          onSkip={mockHandlers.onSkip}
          onRetry={mockHandlers.onRetry}
        />
      );

      expect(screen.getByText(/Unsplash/i)).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should call onSelect when image is selected', async () => {
      const mockHandlers = {
        onSelect: vi.fn(),
        onSkip: vi.fn(),
        onRetry: vi.fn(),
      };

      render(
        <ImageSelectionModal
          results={mockResults}
          recipeName="Pasta Carbonara"
          onSelect={mockHandlers.onSelect}
          onSkip={mockHandlers.onSkip}
          onRetry={mockHandlers.onRetry}
        />
      );

      const selectButton = screen.getByText(/Dieses Bild/i);
      fireEvent.click(selectButton);

      expect(mockHandlers.onSelect).toHaveBeenCalledWith(mockResults[0].url);
    });

    it('should call onSkip when skip button clicked', () => {
      const mockHandlers = {
        onSelect: vi.fn(),
        onSkip: vi.fn(),
        onRetry: vi.fn(),
      };

      render(
        <ImageSelectionModal
          results={mockResults}
          recipeName="Pasta Carbonara"
          onSelect={mockHandlers.onSelect}
          onSkip={mockHandlers.onSkip}
          onRetry={mockHandlers.onRetry}
        />
      );

      const skipButton = screen.getByText(/Überspringen/i);
      fireEvent.click(skipButton);

      expect(mockHandlers.onSkip).toHaveBeenCalled();
    });

    it('should call onRetry when retry button clicked', () => {
      const mockHandlers = {
        onSelect: vi.fn(),
        onSkip: vi.fn(),
        onRetry: vi.fn(),
      };

      render(
        <ImageSelectionModal
          results={mockResults}
          recipeName="Pasta Carbonara"
          onSelect={mockHandlers.onSelect}
          onSkip={mockHandlers.onSkip}
          onRetry={mockHandlers.onRetry}
        />
      );

      const retryButton = screen.getByText(/Andere suchen/i);
      fireEvent.click(retryButton);

      expect(mockHandlers.onRetry).toHaveBeenCalled();
    });
  });

  describe('Image Navigation', () => {
    it('should update counter when image is selected', () => {
      const mockHandlers = {
        onSelect: vi.fn(),
        onSkip: vi.fn(),
        onRetry: vi.fn(),
      };

      const { container } = render(
        <ImageSelectionModal
          results={mockResults}
          recipeName="Pasta Carbonara"
          onSelect={mockHandlers.onSelect}
          onSkip={mockHandlers.onSkip}
          onRetry={mockHandlers.onRetry}
        />
      );

      // Click second thumbnail
      const thumbnails = container.querySelectorAll('button[style*="border"]');
      if (thumbnails.length > 1) {
        fireEvent.click(thumbnails[1]);
        expect(screen.getByText(/2 \/ 3/i)).toBeInTheDocument();
      }
    });
  });

  describe('No Images State', () => {
    it('should show error message when no results', () => {
      const mockHandlers = {
        onSelect: vi.fn(),
        onSkip: vi.fn(),
        onRetry: vi.fn(),
      };

      render(
        <ImageSelectionModal
          results={[]}
          recipeName="Unknown Recipe"
          onSelect={mockHandlers.onSelect}
          onSkip={mockHandlers.onSkip}
          onRetry={mockHandlers.onRetry}
        />
      );

      expect(screen.getByText(/Keine Bilder gefunden/i)).toBeInTheDocument();
    });

    it('should still show retry and skip buttons when no images', () => {
      const mockHandlers = {
        onSelect: vi.fn(),
        onSkip: vi.fn(),
        onRetry: vi.fn(),
      };

      render(
        <ImageSelectionModal
          results={[]}
          recipeName="Unknown Recipe"
          onSelect={mockHandlers.onSelect}
          onSkip={mockHandlers.onSkip}
          onRetry={mockHandlers.onRetry}
        />
      );

      expect(screen.getByText(/Nochmal suchen/i)).toBeInTheDocument();
      expect(screen.getByText(/Überspringen/i)).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should disable buttons when loading', () => {
      const mockHandlers = {
        onSelect: vi.fn(),
        onSkip: vi.fn(),
        onRetry: vi.fn(),
      };

      const { container } = render(
        <ImageSelectionModal
          results={mockResults}
          recipeName="Pasta Carbonara"
          onSelect={mockHandlers.onSelect}
          onSkip={mockHandlers.onSkip}
          onRetry={mockHandlers.onRetry}
          loading={true}
        />
      );

      const buttons = container.querySelectorAll('button[disabled]');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe('Accessibility', () => {
    it('should have alt text on images', () => {
      const mockHandlers = {
        onSelect: vi.fn(),
        onSkip: vi.fn(),
        onRetry: vi.fn(),
      };

      const { container } = render(
        <ImageSelectionModal
          results={mockResults}
          recipeName="Pasta Carbonara"
          onSelect={mockHandlers.onSelect}
          onSkip={mockHandlers.onSkip}
          onRetry={mockHandlers.onRetry}
        />
      );

      const imgs = container.querySelectorAll('img');
      imgs.forEach((img) => {
        expect(img.getAttribute('alt')).toBeTruthy();
      });
    });

    it('should have readable button labels', () => {
      const mockHandlers = {
        onSelect: vi.fn(),
        onSkip: vi.fn(),
        onRetry: vi.fn(),
      };

      render(
        <ImageSelectionModal
          results={mockResults}
          recipeName="Pasta Carbonara"
          onSelect={mockHandlers.onSelect}
          onSkip={mockHandlers.onSkip}
          onRetry={mockHandlers.onRetry}
        />
      );

      expect(screen.getByText(/Dieses Bild/i)).toBeInTheDocument();
      expect(screen.getByText(/Andere suchen/i)).toBeInTheDocument();
      expect(screen.getByText(/Überspringen/i)).toBeInTheDocument();
    });
  });
});
