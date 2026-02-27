import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { pwdApi } from "@/lib/api/pwd";
import { buildShareUrl, extractTokenFromInput } from "@/lib/utils/token";
import { ExpiresUnit, toExpirationSeconds } from "@/lib/utils/time";
import { generatePassword } from "@/lib/utils/password";

type Created = { pwdId: string; url: string };

const MIN_LEN = 8;
const MAX_LEN = 128;
const MIN_LIMIT = 1;
const MAX_LIMIT = 100;
const MAX_EXPIRES = 999;

export function useSecretForm() {
  const router = useRouter();

  const [useLetters, setUseLetters] = useState(true);
  const [useDigits, setUseDigits] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);

  const [password, setPassword] = useState("");
  const [length, setLength] = useState<number | "">(12);

  const [expiresValue, setExpiresValue] = useState<number | "">(10);
  const [expiresUnit, setExpiresUnit] = useState<ExpiresUnit>("Minutos");

  const [viewLimit, setViewLimit] = useState<number | "">(1);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [created, setCreated] = useState<Created | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [tokenInput, setTokenInput] = useState("");
  const [tokenError, setTokenError] = useState("");
  const [configError, setConfigError] = useState("");

  const canGenerate = useLetters || useDigits || useSymbols;
  const hasTypedPassword = password.trim().length > 0;

  const expiresLabel = `${expiresValue} ${expiresUnit}`;
  const viewLimitNumber = Number(viewLimit) || MIN_LIMIT;

  const charsetOptions = useMemo(
    () => [
      { id: "l", label: "ABC", checked: useLetters, set: setUseLetters },
      { id: "d", label: "123", checked: useDigits, set: setUseDigits },
      { id: "s", label: "#$!", checked: useSymbols, set: setUseSymbols },
    ],
    [useLetters, useDigits, useSymbols]
  );

  const unitOptions: ExpiresUnit[] = ["Segundos", "Minutos", "Dias"];

  const clearConfigError = () => {
    if (configError) setConfigError("");
  };

  const onPasswordChange = (v: string) => {
    setPassword(v);
    clearConfigError();
  };

  const onPasswordClear = () => {
    setPassword("");
    clearConfigError();
  };

  const onLengthChange = (v: number | "") => {
    setLength(v);
    clearConfigError();
  };

  const onExpiresValueChange = (v: number | "") => {
    setExpiresValue(v);
    clearConfigError();
  };

  const onExpiresUnitChange = (u: ExpiresUnit) => {
    setExpiresUnit(u);
    clearConfigError();
  };

  const onViewLimitChange = (v: number | "") => {
    setViewLimit(v);
    clearConfigError();
  };

  const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

  const onViewLimitDec = () => {
    const next = clamp(viewLimitNumber - 1, MIN_LIMIT, MAX_LIMIT);
    setViewLimit(next);
    clearConfigError();
  };

  const onViewLimitInc = () => {
    const next = clamp(viewLimitNumber + 1, MIN_LIMIT, MAX_LIMIT);
    setViewLimit(next);
    clearConfigError();
  };

  const validateLength = (len: number) => {
    if (!Number.isFinite(len) || !Number.isInteger(len)) return "Tamanho inválido.";
    if (len < MIN_LEN) return `O tamanho mínimo para gerar é ${MIN_LEN}.`;
    if (len > MAX_LEN) return `O tamanho máximo permitido é ${MAX_LEN}.`;
    return "";
  };

  const handleGeneratePreview = () => {
    if (!canGenerate) return setConfigError("Selecione ao menos um tipo de caractere.");

    const len = Number(length);
    const lenError = validateLength(len);
    if (lenError) return setConfigError(lenError);

    setConfigError("");
    setPassword(generatePassword({ useLetters, useDigits, useSymbols, length: len }));
  };

  const handleSave = async () => {
    const exp = Number(expiresValue);
    const len = Number(length);
    const limit = Number(viewLimit);

    if (!hasTypedPassword && !canGenerate) return setConfigError("Defina uma senha ou parametrize a geração.");

    if (!expiresValue || exp < 1) return setConfigError("O tempo de destruição deve ser no mínimo 1.");
    if (exp > MAX_EXPIRES) return setConfigError("O tempo de destruição é muito alto.");

    if (!viewLimit || limit < MIN_LIMIT) return setConfigError("O limite de acessos deve ser no mínimo 1.");
    if (limit > MAX_LIMIT) return setConfigError(`O limite máximo de acessos permitido é ${MAX_LIMIT}.`);

    if (!hasTypedPassword) {
      const lenError = validateLength(len);
      if (lenError) return setConfigError(lenError);
    }

    try {
      setIsSubmitting(true);
      setConfigError("");
      setErrorMessage(null);

      const payload = {
        pass_view_limit: clamp(limit, MIN_LIMIT, MAX_LIMIT),
        expiration_in_seconds: toExpirationSeconds(exp, expiresUnit),
        ...(hasTypedPassword
          ? { sended_password: password.trim() }
          : {
              use_letters: useLetters,
              use_digits: useDigits,
              use_punctuation: useSymbols,
              pass_length: len,
            }),
      };

      const { pwdId } = await pwdApi.create(payload);
      setCreated({ pwdId, url: buildShareUrl(pwdId) });
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        "Não conseguimos validar sua solicitação agora. Confira sua conexão com a internet e tente novamente em instantes.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onTokenChange = (v: string) => {
    setTokenInput(v);
    if (tokenError) setTokenError("");
  };

  const handleGoToToken = () => {
    const raw = tokenInput.trim();
    if (!raw) return setTokenError("Informe o token ou cole a URL.");

    const token = extractTokenFromInput(raw);
    if (!token) return setTokenError("Token inválido.");

    setTokenError("");
    router.push(`/visualizar/${encodeURIComponent(token)}`);
  };

  const closeCreated = () => setCreated(null);

  const closeError = () => setErrorMessage(null);

  const copyCreatedUrl = async () => {
    if (created?.url) await navigator.clipboard.writeText(created.url);
  };

  const viewNow = () => {
    if (created?.pwdId) router.push(`/visualizar/${encodeURIComponent(created.pwdId)}`);
  };

  return {
    isSubmitting,
    created,
    errorMessage,

    configError,
    tokenInput,
    tokenError,

    password,
    length,
    expiresValue,
    expiresUnit,
    viewLimit,

    hasTypedPassword,
    expiresLabel,
    viewLimitNumber,

    charsetOptions,
    unitOptions,

    onPasswordChange,
    onPasswordClear,
    onLengthChange,
    onExpiresValueChange,
    onExpiresUnitChange,
    onViewLimitChange,
    onViewLimitDec,
    onViewLimitInc,

    onTokenChange,

    handleGeneratePreview,
    handleSave,
    handleGoToToken,

    closeCreated,
    closeError,
    copyCreatedUrl,
    viewNow,
  };
}