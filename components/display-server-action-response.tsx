type Props = {
  result: {
    data?: {
      message?: string;
    };
    serverError?: string;
    validationErrors?: Record<string, string[] | undefined>;
  };
};

function MessageBox({
  type,
  content,
}: {
  type: 'success' | 'error';
  content: React.ReactNode;
}) {
  return (
    <div
      className={`bg-accent px-4 py-2 my-2 rounded-lg ${
        type === 'error' ? 'text-red-700' : ''
      }`}
    >
      {type === 'success' ? '🎉' : '🚨'} {content}
    </div>
  );
}

export default function DisplayServerActionResponse({ result }: Props) {
  const { data, serverError, validationErrors } = result;

  return (
    <div>
      {' '}
      {data?.message && (
        <MessageBox type='success' content={`Sucess : ${data.message}`} />
      )}
    </div>
  );
}