



// tests/pages/PatientListPage.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { vi, describe, it, expect, beforeEach, type Mock } from 'vitest';
// FIX: Use namespace import for react-router-dom to fix module resolution issues.
import * as ReactRouterDOM from 'react-router-dom';
import PatientListPage from '../../pages/PatientListPage';
import { usePatients } from '../../hooks/usePatients';
// FIX: Import PatientStatus enum.
import { PatientSummary, PatientStatus } from '../../types';

// Mock the custom hook
vi.mock('../../hooks/usePatients');

// Mock child components to isolate the test
vi.mock('../../components/PageHeader', () => ({
  default: ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  ),
}));

vi.mock('../../components/PatientFormModal', () => ({
  default: ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) =>
    isOpen ? (
      <div data-testid="patient-form-modal">
        Modal Aberto <button onClick={onClose}>Fechar</button>
      </div>
    ) : null,
}));

// Mock the Toast context
vi.mock('../../contexts/ToastContext', () => ({
  useToast: () => ({
    showToast: vi.fn(),
  }),
}));

// Mock debounce to make it immediate for tests
vi.mock('../../hooks/useDebounce', () => ({
  useDebounce: (value: any) => value,
}));


const mockUsePatients = usePatients as Mock;
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
    const original = await vi.importActual('react-router-dom');
    return {
        ...(original as object),
        useNavigate: () => mockNavigate,
    };
});


describe('PatientListPage', () => {
    const mockFetchInitial = vi.fn();
    const mockFetchMore = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock implementation for usePatients
    mockUsePatients.mockReturnValue({
        patients: [],
        isLoading: true,
        isLoadingMore: false,
        hasMore: false,
        error: null,
        fetchInitialPatients: mockFetchInitial,
        fetchMorePatients: mockFetchMore,
        addPatient: vi.fn(),
    });
  });

  const renderComponent = () => {
    render(
      <ReactRouterDOM.MemoryRouter>
        <PatientListPage />
      </ReactRouterDOM.MemoryRouter>
    );
  };

  it('deve chamar fetchInitialPatients na montagem', () => {
    renderComponent();
    expect(mockFetchInitial).toHaveBeenCalledWith({ searchTerm: '', statusFilter: 'All', startDate: '', endDate: '', therapistId: 'All' });
  });

  it('deve renderizar o estado de carregamento corretamente', () => {
    mockUsePatients.mockReturnValue({ ...mockUsePatients(), isLoading: true, patients: [] });
    renderComponent();
    // Assuming Skeleton renders a specific role or test id would be better.
    // For now, let's just check if it doesn't show the "no patients" message.
    expect(screen.queryByText(/Nenhum paciente encontrado/i)).not.toBeInTheDocument();
  });

  it('deve renderizar o estado de erro corretamente', () => {
    mockUsePatients.mockReturnValue({ ...mockUsePatients(), isLoading: false, error: new Error('Falha na API'), patients: [] });
    renderComponent();
    expect(screen.getByText(/Falha ao carregar pacientes/i)).toBeInTheDocument();
  });

  it('deve renderizar a lista de pacientes quando os dados são carregados', () => {
    const mockData: PatientSummary[] = [
      // FIX: Use PatientStatus enum instead of string literals.
      { id: '1', name: 'Ana Beatriz Costa', email: 'ana@email.com', phone: '123', status: PatientStatus.Active, lastVisit: new Date().toISOString(), avatarUrl: '' },
      { id: '2', name: 'Bruno Gomes', email: 'bruno@email.com', phone: '456', status: PatientStatus.Inactive, lastVisit: new Date().toISOString(), avatarUrl: '' },
    ];
    mockUsePatients.mockReturnValue({ ...mockUsePatients(), patients: mockData, isLoading: false });
    
    renderComponent();
    expect(screen.getByText('Ana Beatriz Costa')).toBeInTheDocument();
    expect(screen.getByText('Bruno Gomes')).toBeInTheDocument();
  });

   it('deve chamar fetchInitialPatients ao alterar o filtro de busca', async () => {
        renderComponent();
        const searchInput = screen.getByPlaceholderText(/Nome ou CPF/i);
        fireEvent.change(searchInput, { target: { value: 'test' } });
        
        await waitFor(() => {
            expect(mockFetchInitial).toHaveBeenCalledWith(expect.objectContaining({ searchTerm: 'test' }));
        });
   });

   it('deve chamar fetchMorePatients ao clicar no botão "Carregar Mais"', () => {
       mockUsePatients.mockReturnValue({ ...mockUsePatients(), isLoading: false, hasMore: true, patients: [{ id: '1', name: 'Ana', email: 'a@a.com', phone: '1', status: PatientStatus.Active, lastVisit: '', avatarUrl: '' }] });
       renderComponent();
       
       const loadMoreButton = screen.getByRole('button', { name: /Carregar Mais Pacientes/i });
       fireEvent.click(loadMoreButton);

       expect(mockFetchMore).toHaveBeenCalled();
   });
});