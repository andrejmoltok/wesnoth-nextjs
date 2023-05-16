import Profile from '../../components/profile';
import { useRouter } from 'next/router';

function ProfileID() {

    const router = useRouter();

    const { id } = router.query;

    return (
        <> 
          <Profile getID={id} />
        </>
    )
}

export default ProfileID;