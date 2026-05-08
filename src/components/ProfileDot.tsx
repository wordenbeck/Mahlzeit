import './ProfileDot.css';
import { profileById } from '../mocks/recipes';

type Props = {
  profileId: string;
  size?: number;
};

export function ProfileDot({ profileId, size = 16 }: Props) {
  const profile = profileById(profileId);
  return (
    <span
      className="profile-dot"
      style={{
        width: size,
        height: size,
        background: `var(${profile.colorVar})`,
        fontSize: Math.max(8, Math.round(size * 0.5)),
      }}
      title={profile.displayName}
      aria-label={profile.displayName}
    >
      {profile.initial}
    </span>
  );
}
