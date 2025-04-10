// Configuração central do Tappy ID

// URL da API central do Tappy (sistema principal)
export const TAPPY_API_URL = process.env.NEXT_PUBLIC_TAPPY_API_URL?.trim() || 'https://tappy.id';

// ID da plataforma no sistema central
export const PLATFORM_SLUG = 'tappyid';

// Outras configurações
export const APP_NAME = 'Tappy ID';
export const APP_DESCRIPTION = 'Cartão de visita digital com tecnologia NFC e QR Code';
