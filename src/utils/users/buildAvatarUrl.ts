export default function buildAvatarUrl({ id }: {id: string}) {
    return `https://octara.xyz/api/v1/users/${id}/avatar`;
}